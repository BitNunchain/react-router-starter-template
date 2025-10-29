// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/**
 * @title TokenModule
 * @dev Comprehensive token module supporting ERC20, ERC721, and ERC1155 with advanced features
 */
contract TokenModule is ERC1155, AccessControl, ReentrancyGuard, IERC2981, EIP712 {
    using ECDSA for bytes32;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    // Token types
    enum TokenType { ERC20, ERC721, ERC1155 }
    
    // Token information
    struct TokenInfo {
        string name;
        string symbol;
        string uri;
        TokenType tokenType;
        uint256 totalSupply;
        uint256 maxSupply;
        uint256 mintPrice;
        bool exists;
        bool mintingEnabled;
        address creator;
    }
    
    // Royalty information
    struct RoyaltyInfo {
        address recipient;
        uint96 royaltyFraction; // Basis points
    }
    
    // Signature minting
    struct MintRequest {
        address to;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        string uri;
        uint256 nonce;
        uint256 deadline;
    }
    
    // Storage
    mapping(uint256 => TokenInfo) public tokenInfo;
    mapping(uint256 => RoyaltyInfo) public royalties;
    mapping(address => uint256) public nonces;
    mapping(uint256 => bool) public usedNonces;
    
    uint256 public nextTokenId = 1;
    address public platformAddress;
    uint256 public platformFeePercent = 250; // 2.5%
    
    // Events
    event TokenCreated(uint256 indexed tokenId, TokenType tokenType, address creator, string name);
    event TokenMinted(uint256 indexed tokenId, address to, uint256 amount);
    event RoyaltySet(uint256 indexed tokenId, address recipient, uint96 royaltyFraction);
    event BatchMinted(uint256[] tokenIds, address to, uint256[] amounts);
    
    constructor(
        string memory _name,
        string memory _version,
        address _platformAddress
    ) ERC1155("") EIP712(_name, _version) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        platformAddress = _platformAddress;
    }
    
    /**
     * @dev Create a new token
     */
    function createToken(
        string calldata name,
        string calldata symbol,
        string calldata tokenUri,
        TokenType tokenType,
        uint256 maxSupply,
        uint256 mintPrice,
        address royaltyRecipient,
        uint96 royaltyFraction
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        tokenInfo[tokenId] = TokenInfo({
            name: name,
            symbol: symbol,
            uri: tokenUri,
            tokenType: tokenType,
            totalSupply: 0,
            maxSupply: maxSupply,
            mintPrice: mintPrice,
            exists: true,
            mintingEnabled: true,
            creator: msg.sender
        });
        
        if (royaltyRecipient != address(0)) {
            _setTokenRoyalty(tokenId, royaltyRecipient, royaltyFraction);
        }
        
        emit TokenCreated(tokenId, tokenType, msg.sender, name);
        return tokenId;
    }
    
    /**
     * @dev Mint tokens to an address
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes calldata data
    ) external payable nonReentrant {
        require(tokenInfo[tokenId].exists, "Token does not exist");
        require(tokenInfo[tokenId].mintingEnabled, "Minting disabled");
        require(to != address(0), "Cannot mint to zero address");
        
        TokenInfo storage info = tokenInfo[tokenId];
        
        // Check supply limits
        if (info.maxSupply > 0) {
            require(info.totalSupply + amount <= info.maxSupply, "Exceeds max supply");
        }
        
        // Handle payment
        uint256 totalPrice = info.mintPrice * amount;
        if (totalPrice > 0) {
            require(msg.value >= totalPrice, "Insufficient payment");
            
            // Calculate platform fee
            uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
            uint256 creatorPayment = totalPrice - platformFee;
            
            // Transfer payments
            if (platformFee > 0) {
                payable(platformAddress).transfer(platformFee);
            }
            if (creatorPayment > 0) {
                payable(info.creator).transfer(creatorPayment);
            }
            
            // Refund excess
            if (msg.value > totalPrice) {
                payable(msg.sender).transfer(msg.value - totalPrice);
            }
        }
        
        // Mint the token
        _mint(to, tokenId, amount, data);
        info.totalSupply += amount;
        
        emit TokenMinted(tokenId, to, amount);
    }
    
    /**
     * @dev Batch mint multiple tokens
     */
    function batchMint(
        address to,
        uint256[] calldata tokenIds,
        uint256[] calldata amounts,
        bytes calldata data
    ) external payable nonReentrant {
        require(tokenIds.length == amounts.length, "Array length mismatch");
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 totalPrice = 0;
        
        // Validate and calculate total price
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 amount = amounts[i];
            
            require(tokenInfo[tokenId].exists, "Token does not exist");
            require(tokenInfo[tokenId].mintingEnabled, "Minting disabled");
            
            TokenInfo storage info = tokenInfo[tokenId];
            
            if (info.maxSupply > 0) {
                require(info.totalSupply + amount <= info.maxSupply, "Exceeds max supply");
            }
            
            totalPrice += info.mintPrice * amount;
            info.totalSupply += amount;
        }
        
        // Handle payment
        if (totalPrice > 0) {
            require(msg.value >= totalPrice, "Insufficient payment");
            
            uint256 platformFee = (totalPrice * platformFeePercent) / 10000;
            uint256 creatorPayment = totalPrice - platformFee;
            
            if (platformFee > 0) {
                payable(platformAddress).transfer(platformFee);
            }
            if (creatorPayment > 0) {
                payable(tokenInfo[tokenIds[0]].creator).transfer(creatorPayment);
            }
            
            if (msg.value > totalPrice) {
                payable(msg.sender).transfer(msg.value - totalPrice);
            }
        }
        
        // Batch mint
        _mintBatch(to, tokenIds, amounts, data);
        
        emit BatchMinted(tokenIds, to, amounts);
    }
    
    /**
     * @dev Signature-based minting
     */
    function signatureMint(
        MintRequest calldata req,
        bytes calldata signature
    ) external payable nonReentrant {
        require(block.timestamp <= req.deadline, "Signature expired");
        require(!usedNonces[req.nonce], "Nonce already used");
        require(req.to != address(0), "Cannot mint to zero address");
        
        // Verify signature
        bytes32 structHash = keccak256(abi.encode(
            keccak256("MintRequest(address to,uint256 tokenId,uint256 amount,uint256 price,string uri,uint256 nonce,uint256 deadline)"),
            req.to,
            req.tokenId,
            req.amount,
            req.price,
            keccak256(bytes(req.uri)),
            req.nonce,
            req.deadline
        ));
        
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);
        require(hasRole(MINTER_ROLE, signer), "Invalid signature");
        
        usedNonces[req.nonce] = true;
        
        // Handle payment
        if (req.price > 0) {
            require(msg.value >= req.price, "Insufficient payment");
            
            uint256 platformFee = (req.price * platformFeePercent) / 10000;
            uint256 creatorPayment = req.price - platformFee;
            
            if (platformFee > 0) {
                payable(platformAddress).transfer(platformFee);
            }
            if (creatorPayment > 0) {
                payable(tokenInfo[req.tokenId].creator).transfer(creatorPayment);
            }
            
            if (msg.value > req.price) {
                payable(msg.sender).transfer(msg.value - req.price);
            }
        }
        
        // Create token if it doesn't exist
        if (!tokenInfo[req.tokenId].exists) {
            tokenInfo[req.tokenId] = TokenInfo({
                name: "Signature Minted Token",
                symbol: "SMT",
                uri: req.uri,
                tokenType: TokenType.ERC1155,
                totalSupply: 0,
                maxSupply: 0,
                mintPrice: req.price,
                exists: true,
                mintingEnabled: true,
                creator: signer
            });
        }
        
        // Mint the token
        _mint(req.to, req.tokenId, req.amount, "");
        tokenInfo[req.tokenId].totalSupply += req.amount;
        
        emit TokenMinted(req.tokenId, req.to, req.amount);
    }
    
    /**
     * @dev Set royalty information for a token
     */
    function _setTokenRoyalty(uint256 tokenId, address recipient, uint96 feeNumerator) internal {
        require(feeNumerator <= 1000, "Royalty too high"); // Max 10%
        royalties[tokenId] = RoyaltyInfo(recipient, feeNumerator);
        emit RoyaltySet(tokenId, recipient, feeNumerator);
    }
    
    /**
     * @dev Set royalty for a token (only token creator or admin)
     */
    function setTokenRoyalty(uint256 tokenId, address recipient, uint96 feeNumerator) external {
        require(
            msg.sender == tokenInfo[tokenId].creator || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        _setTokenRoyalty(tokenId, recipient, feeNumerator);
    }
    
    /**
     * @dev Toggle minting for a token
     */
    function toggleMinting(uint256 tokenId) external {
        require(
            msg.sender == tokenInfo[tokenId].creator || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        tokenInfo[tokenId].mintingEnabled = !tokenInfo[tokenId].mintingEnabled;
    }
    
    /**
     * @dev Get token URI
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenInfo[tokenId].exists, "Token does not exist");
        return tokenInfo[tokenId].uri;
    }
    
    /**
     * @dev Update token URI
     */
    function setTokenURI(uint256 tokenId, string calldata newUri) external {
        require(
            msg.sender == tokenInfo[tokenId].creator || hasRole(ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        tokenInfo[tokenId].uri = newUri;
    }
    
    /**
     * @dev Get royalty information
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address, uint256)
    {
        RoyaltyInfo memory royalty = royalties[tokenId];
        uint256 royaltyAmount = (salePrice * royalty.royaltyFraction) / 10000;
        return (royalty.recipient, royaltyAmount);
    }
    
    /**
     * @dev Check interface support
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo(uint256 tokenId) external view returns (TokenInfo memory) {
        return tokenInfo[tokenId];
    }
    
    /**
     * @dev Update platform settings
     */
    function updatePlatformSettings(address newPlatformAddress, uint256 newFeePercent)
        external
        onlyRole(ADMIN_ROLE)
    {
        require(newFeePercent <= 1000, "Fee too high");
        platformAddress = newPlatformAddress;
        platformFeePercent = newFeePercent;
    }
}