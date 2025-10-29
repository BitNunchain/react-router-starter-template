// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MarketplaceModule
 * @dev Comprehensive marketplace for buying, selling, and auctioning NFTs
 */
contract MarketplaceModule is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Listing types
    enum ListingType { FixedPrice, Auction, Offer }
    enum TokenStandard { ERC721, ERC1155 }
    
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // For ERC1155
        uint256 price;
        address paymentToken; // address(0) for ETH
        TokenStandard tokenStandard;
        ListingType listingType;
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool sold;
    }
    
    struct Auction {
        uint256 listingId;
        address highestBidder;
        uint256 highestBid;
        uint256 reservePrice;
        uint256 bidIncrement;
        mapping(address => uint256) bids;
        address[] bidders;
        bool ended;
    }
    
    struct Offer {
        uint256 offerId;
        address buyer;
        address nftContract;
        uint256 tokenId;
        uint256 amount; // For ERC1155
        uint256 offerPrice;
        address paymentToken;
        uint256 deadline;
        bool active;
        bool accepted;
    }
    
    // Storage
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Offer) public offers;
    
    uint256 public nextListingId = 1;
    uint256 public nextOfferId = 1;
    
    // Platform settings
    uint256 public platformFeePercent = 250; // 2.5%
    address public feeRecipient;
    address public platformAddress;
    
    // Approved payment tokens
    mapping(address => bool) public approvedPaymentTokens;
    
    // Events
    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price,
        ListingType listingType
    );
    
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);
    event ListingCanceled(uint256 indexed listingId);
    
    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    event BidPlaced(
        uint256 indexed listingId,
        address indexed bidder,
        uint256 bidAmount
    );
    
    event AuctionEnded(
        uint256 indexed listingId,
        address indexed winner,
        uint256 winningBid
    );
    
    event OfferCreated(
        uint256 indexed offerId,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 offerPrice
    );
    
    event OfferAccepted(
        uint256 indexed offerId,
        address indexed seller,
        address indexed buyer
    );
    
    constructor(address _feeRecipient, address _platformAddress) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        require(_platformAddress != address(0), "Invalid platform address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        feeRecipient = _feeRecipient;
        platformAddress = _platformAddress;
        
        // Approve ETH by default
        approvedPaymentTokens[address(0)] = true;
    }
    
    /**
     * @dev Create a fixed price listing
     */
    function createListing(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address paymentToken,
        TokenStandard tokenStandard,
        uint256 duration
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(approvedPaymentTokens[paymentToken], "Payment token not approved");
        require(duration > 0, "Duration must be greater than 0");
        
        // Verify ownership and transfer NFT to contract
        if (tokenStandard == TokenStandard.ERC721) {
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
            require(amount == 1, "ERC721 amount must be 1");
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        } else {
            require(IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
            IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        }
        
        uint256 listingId = nextListingId++;
        uint256 endTime = block.timestamp + duration;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            price: price,
            paymentToken: paymentToken,
            tokenStandard: tokenStandard,
            listingType: ListingType.FixedPrice,
            startTime: block.timestamp,
            endTime: endTime,
            active: true,
            sold: false
        });
        
        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, price, ListingType.FixedPrice);
        return listingId;
    }
    
    /**
     * @dev Create an auction listing
     */
    function createAuction(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 reservePrice,
        uint256 bidIncrement,
        address paymentToken,
        TokenStandard tokenStandard,
        uint256 duration
    ) external nonReentrant returns (uint256) {
        require(reservePrice > 0, "Reserve price must be greater than 0");
        require(bidIncrement > 0, "Bid increment must be greater than 0");
        require(approvedPaymentTokens[paymentToken], "Payment token not approved");
        require(duration > 0, "Duration must be greater than 0");
        
        // Transfer NFT to contract
        if (tokenStandard == TokenStandard.ERC721) {
            require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
            require(amount == 1, "ERC721 amount must be 1");
            IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        } else {
            require(IERC1155(nftContract).balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
            IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        }
        
        uint256 listingId = nextListingId++;
        uint256 endTime = block.timestamp + duration;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            price: reservePrice,
            paymentToken: paymentToken,
            tokenStandard: tokenStandard,
            listingType: ListingType.Auction,
            startTime: block.timestamp,
            endTime: endTime,
            active: true,
            sold: false
        });
        
        // Initialize auction
        auctions[listingId].listingId = listingId;
        auctions[listingId].reservePrice = reservePrice;
        auctions[listingId].bidIncrement = bidIncrement;
        auctions[listingId].ended = false;
        
        emit ListingCreated(listingId, msg.sender, nftContract, tokenId, reservePrice, ListingType.Auction);
        return listingId;
    }
    
    /**
     * @dev Buy a fixed price listing
     */
    function buyNow(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.listingType == ListingType.FixedPrice, "Not a fixed price listing");
        require(block.timestamp <= listing.endTime, "Listing expired");
        require(!listing.sold, "Already sold");
        
        uint256 totalPrice = listing.price;
        
        // Handle payment
        if (listing.paymentToken == address(0)) {
            require(msg.value >= totalPrice, "Insufficient payment");
        } else {
            require(IERC20(listing.paymentToken).transferFrom(msg.sender, address(this), totalPrice), "Payment failed");
        }
        
        // Calculate fees and payments
        uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
        uint256 royaltyFee = 0;
        address royaltyRecipient = address(0);
        
        // Check for royalties
        if (IERC165(listing.nftContract).supportsInterface(type(IERC2981).interfaceId)) {
            (royaltyRecipient, royaltyFee) = IERC2981(listing.nftContract).royaltyInfo(listing.tokenId, totalPrice);
        }
        
        uint256 sellerPayment = totalPrice - platformFee - royaltyFee;
        
        // Transfer payments
        if (listing.paymentToken == address(0)) {
            if (platformFee > 0) payable(feeRecipient).transfer(platformFee);
            if (royaltyFee > 0) payable(royaltyRecipient).transfer(royaltyFee);
            if (sellerPayment > 0) payable(listing.seller).transfer(sellerPayment);
            
            // Refund excess
            if (msg.value > totalPrice) {
                payable(msg.sender).transfer(msg.value - totalPrice);
            }
        } else {
            if (platformFee > 0) IERC20(listing.paymentToken).transfer(feeRecipient, platformFee);
            if (royaltyFee > 0) IERC20(listing.paymentToken).transfer(royaltyRecipient, royaltyFee);
            if (sellerPayment > 0) IERC20(listing.paymentToken).transfer(listing.seller, sellerPayment);
        }
        
        // Transfer NFT to buyer
        if (listing.tokenStandard == TokenStandard.ERC721) {
            IERC721(listing.nftContract).transferFrom(address(this), msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId, listing.amount, "");
        }
        
        // Update listing
        listing.active = false;
        listing.sold = true;
        
        emit ItemSold(listingId, msg.sender, listing.seller, totalPrice);
    }
    
    /**
     * @dev Place a bid on an auction
     */
    function placeBid(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.listingType == ListingType.Auction, "Not an auction");
        require(block.timestamp <= listing.endTime, "Auction ended");
        
        Auction storage auction = auctions[listingId];
        require(!auction.ended, "Auction already ended");
        
        uint256 bidAmount;
        
        if (listing.paymentToken == address(0)) {
            bidAmount = msg.value;
            require(bidAmount >= auction.reservePrice, "Bid below reserve price");
            require(bidAmount >= auction.highestBid + auction.bidIncrement, "Bid increment too low");
        } else {
            revert("Token bids not implemented yet");
        }
        
        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        
        // Update auction state
        auction.highestBidder = msg.sender;
        auction.highestBid = bidAmount;
        auction.bids[msg.sender] = bidAmount;
        
        // Add to bidders array if first bid
        if (auction.bids[msg.sender] == bidAmount) {
            auction.bidders.push(msg.sender);
        }
        
        emit BidPlaced(listingId, msg.sender, bidAmount);
    }
    
    /**
     * @dev End an auction
     */
    function endAuction(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.listingType == ListingType.Auction, "Not an auction");
        require(block.timestamp > listing.endTime, "Auction not ended");
        
        Auction storage auction = auctions[listingId];
        require(!auction.ended, "Auction already ended");
        
        auction.ended = true;
        listing.active = false;
        
        if (auction.highestBidder != address(0)) {
            uint256 totalPrice = auction.highestBid;
            
            // Calculate fees
            uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
            uint256 royaltyFee = 0;
            address royaltyRecipient = address(0);
            
            // Check for royalties
            if (IERC165(listing.nftContract).supportsInterface(type(IERC2981).interfaceId)) {
                (royaltyRecipient, royaltyFee) = IERC2981(listing.nftContract).royaltyInfo(listing.tokenId, totalPrice);
            }
            
            uint256 sellerPayment = totalPrice - platformFee - royaltyFee;
            
            // Transfer payments
            if (platformFee > 0) payable(feeRecipient).transfer(platformFee);
            if (royaltyFee > 0) payable(royaltyRecipient).transfer(royaltyFee);
            if (sellerPayment > 0) payable(listing.seller).transfer(sellerPayment);
            
            // Transfer NFT to winner
            if (listing.tokenStandard == TokenStandard.ERC721) {
                IERC721(listing.nftContract).transferFrom(address(this), auction.highestBidder, listing.tokenId);
            } else {
                IERC1155(listing.nftContract).safeTransferFrom(address(this), auction.highestBidder, listing.tokenId, listing.amount, "");
            }
            
            listing.sold = true;
            
            emit AuctionEnded(listingId, auction.highestBidder, auction.highestBid);
            emit ItemSold(listingId, auction.highestBidder, listing.seller, totalPrice);
        } else {
            // No bids, return NFT to seller
            if (listing.tokenStandard == TokenStandard.ERC721) {
                IERC721(listing.nftContract).transferFrom(address(this), listing.seller, listing.tokenId);
            } else {
                IERC1155(listing.nftContract).safeTransferFrom(address(this), listing.seller, listing.tokenId, listing.amount, "");
            }
            
            emit AuctionEnded(listingId, address(0), 0);
        }
    }
    
    /**
     * @dev Create an offer for an NFT
     */
    function createOffer(
        address nftContract,
        uint256 tokenId,
        uint256 amount,
        uint256 offerPrice,
        address paymentToken,
        uint256 deadline
    ) external payable nonReentrant returns (uint256) {
        require(offerPrice > 0, "Offer price must be greater than 0");
        require(deadline > block.timestamp, "Invalid deadline");
        require(approvedPaymentTokens[paymentToken], "Payment token not approved");
        
        uint256 offerId = nextOfferId++;
        
        // Handle payment escrow
        if (paymentToken == address(0)) {
            require(msg.value >= offerPrice, "Insufficient payment");
        } else {
            require(IERC20(paymentToken).transferFrom(msg.sender, address(this), offerPrice), "Payment failed");
        }
        
        offers[offerId] = Offer({
            offerId: offerId,
            buyer: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            amount: amount,
            offerPrice: offerPrice,
            paymentToken: paymentToken,
            deadline: deadline,
            active: true,
            accepted: false
        });
        
        emit OfferCreated(offerId, msg.sender, nftContract, tokenId, offerPrice);
        return offerId;
    }
    
    /**
     * @dev Accept an offer
     */
    function acceptOffer(uint256 offerId, TokenStandard tokenStandard) external nonReentrant {
        Offer storage offer = offers[offerId];
        require(offer.active, "Offer not active");
        require(block.timestamp <= offer.deadline, "Offer expired");
        require(!offer.accepted, "Offer already accepted");
        
        // Verify ownership
        if (tokenStandard == TokenStandard.ERC721) {
            require(IERC721(offer.nftContract).ownerOf(offer.tokenId) == msg.sender, "Not the owner");
            require(offer.amount == 1, "ERC721 amount must be 1");
        } else {
            require(IERC1155(offer.nftContract).balanceOf(msg.sender, offer.tokenId) >= offer.amount, "Insufficient balance");
        }
        
        uint256 totalPrice = offer.offerPrice;
        
        // Calculate fees
        uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
        uint256 royaltyFee = 0;
        address royaltyRecipient = address(0);
        
        // Check for royalties
        if (IERC165(offer.nftContract).supportsInterface(type(IERC2981).interfaceId)) {
            (royaltyRecipient, royaltyFee) = IERC2981(offer.nftContract).royaltyInfo(offer.tokenId, totalPrice);
        }
        
        uint256 sellerPayment = totalPrice - platformFee - royaltyFee;
        
        // Transfer payments
        if (offer.paymentToken == address(0)) {
            if (platformFee > 0) payable(feeRecipient).transfer(platformFee);
            if (royaltyFee > 0) payable(royaltyRecipient).transfer(royaltyFee);
            if (sellerPayment > 0) payable(msg.sender).transfer(sellerPayment);
        } else {
            if (platformFee > 0) IERC20(offer.paymentToken).transfer(feeRecipient, platformFee);
            if (royaltyFee > 0) IERC20(offer.paymentToken).transfer(royaltyRecipient, royaltyFee);
            if (sellerPayment > 0) IERC20(offer.paymentToken).transfer(msg.sender, sellerPayment);
        }
        
        // Transfer NFT to buyer
        if (tokenStandard == TokenStandard.ERC721) {
            IERC721(offer.nftContract).transferFrom(msg.sender, offer.buyer, offer.tokenId);
        } else {
            IERC1155(offer.nftContract).safeTransferFrom(msg.sender, offer.buyer, offer.tokenId, offer.amount, "");
        }
        
        // Update offer
        offer.active = false;
        offer.accepted = true;
        
        emit OfferAccepted(offerId, msg.sender, offer.buyer);
    }
    
    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        require(listing.active, "Listing not active");
        
        if (listing.listingType == ListingType.Auction) {
            Auction storage auction = auctions[listingId];
            require(auction.highestBidder == address(0), "Auction has bids");
        }
        
        listing.active = false;
        
        // Return NFT to seller
        if (listing.tokenStandard == TokenStandard.ERC721) {
            IERC721(listing.nftContract).transferFrom(address(this), listing.seller, listing.tokenId);
        } else {
            IERC1155(listing.nftContract).safeTransferFrom(address(this), listing.seller, listing.tokenId, listing.amount, "");
        }
        
        emit ListingCanceled(listingId);
    }
    
    /**
     * @dev Update platform fee
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyRole(ADMIN_ROLE) {
        require(newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Update fee recipient
     */
    function updateFeeRecipient(address newRecipient) external onlyRole(ADMIN_ROLE) {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Approve payment token
     */
    function setPaymentTokenApproval(address token, bool approved) external onlyRole(ADMIN_ROLE) {
        approvedPaymentTokens[token] = approved;
    }
    
    // ERC1155 Receiver
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }
    
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}