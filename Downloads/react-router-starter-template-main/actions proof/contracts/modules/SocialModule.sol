// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @title SocialModule
 * @dev Comprehensive social features including airdrops, social integrations, and community features
 */
contract SocialModule is AccessControl, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant AIRDROP_ROLE = keccak256("AIRDROP_ROLE");
    
    // Airdrop structures
    enum AirdropType { ERC20, ERC1155, ETH }
    enum AirdropStatus { Active, Paused, Completed, Cancelled }
    
    struct Airdrop {
        uint256 airdropId;
        string name;
        AirdropType airdropType;
        address token;
        uint256 tokenId; // For ERC1155
        uint256 totalAmount;
        uint256 amountPerClaim;
        uint256 maxClaims;
        uint256 currentClaims;
        AirdropStatus status;
        uint256 startTime;
        uint256 endTime;
        address creator;
        bool requireSocialVerification;
        mapping(address => bool) claimed;
        mapping(address => bool) whitelisted;
    }
    
    // Social verification structures
    struct SocialProfile {
        string farcasterHandle;
        string lensHandle;
        string twitterHandle;
        uint256 farcasterFollowers;
        uint256 lensFollowers;
        uint256 twitterFollowers;
        bool verified;
        uint256 socialScore;
        uint256 lastUpdated;
    }
    
    struct SocialQuest {
        uint256 questId;
        string title;
        string description;
        uint256 reward;
        address rewardToken;
        uint256 rewardTokenId; // For ERC1155
        string requiredAction; // "follow", "cast", "mirror", "like"
        string platform; // "farcaster", "lens", "twitter"
        uint256 minFollowers;
        uint256 duration;
        uint256 maxParticipants;
        uint256 currentParticipants;
        bool active;
        mapping(address => bool) completed;
    }
    
    // Community features
    struct Community {
        uint256 communityId;
        string name;
        string description;
        address creator;
        address membershipToken;
        uint256 minTokenBalance;
        uint256 memberCount;
        bool public_;
        bool active;
        mapping(address => bool) members;
        mapping(address => bool) moderators;
    }
    
    struct Post {
        uint256 postId;
        uint256 communityId;
        address author;
        string content;
        string mediaUri;
        uint256 timestamp;
        uint256 likes;
        uint256 replies;
        bool pinned;
        mapping(address => bool) likedBy;
    }
    
    // Storage
    mapping(uint256 => Airdrop) public airdrops;
    mapping(address => SocialProfile) public socialProfiles;
    mapping(uint256 => SocialQuest) public socialQuests;
    mapping(uint256 => Community) public communities;
    mapping(uint256 => Post) public posts;
    
    uint256 public nextAirdropId = 1;
    uint256 public nextQuestId = 1;
    uint256 public nextCommunityId = 1;
    uint256 public nextPostId = 1;
    
    // Platform settings
    address public platformAddress;
    mapping(address => bool) public socialVerifiers; // Authorized verifiers
    
    // Events
    event AirdropCreated(
        uint256 indexed airdropId,
        address indexed creator,
        string name,
        AirdropType airdropType,
        address token,
        uint256 totalAmount
    );
    
    event AirdropClaimed(
        uint256 indexed airdropId,
        address indexed claimer,
        uint256 amount
    );
    
    event SocialProfileUpdated(
        address indexed user,
        string farcasterHandle,
        string lensHandle,
        uint256 socialScore
    );
    
    event SocialQuestCreated(
        uint256 indexed questId,
        string title,
        string platform,
        uint256 reward
    );
    
    event SocialQuestCompleted(
        uint256 indexed questId,
        address indexed user,
        uint256 reward
    );
    
    event CommunityCreated(
        uint256 indexed communityId,
        address indexed creator,
        string name
    );
    
    event CommunityJoined(
        uint256 indexed communityId,
        address indexed member
    );
    
    event PostCreated(
        uint256 indexed postId,
        uint256 indexed communityId,
        address indexed author,
        string content
    );
    
    event PostLiked(
        uint256 indexed postId,
        address indexed liker
    );
    
    constructor(
        string memory name,
        string memory version,
        address _platformAddress
    ) EIP712(name, version) {
        require(_platformAddress != address(0), "Invalid platform address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(AIRDROP_ROLE, msg.sender);
        
        platformAddress = _platformAddress;
    }
    
    /**
     * @dev Create a new airdrop
     */
    function createAirdrop(
        string calldata name,
        AirdropType airdropType,
        address token,
        uint256 tokenId,
        uint256 totalAmount,
        uint256 amountPerClaim,
        uint256 duration,
        bool requireSocialVerification
    ) external payable nonReentrant returns (uint256) {
        require(totalAmount > 0 && amountPerClaim > 0, "Invalid amounts");
        require(totalAmount >= amountPerClaim, "Total amount too small");
        require(duration > 0, "Invalid duration");
        
        uint256 airdropId = nextAirdropId++;
        uint256 maxClaims = totalAmount / amountPerClaim;
        
        // Handle funding
        if (airdropType == AirdropType.ETH) {
            require(msg.value >= totalAmount, "Insufficient ETH sent");
        } else if (airdropType == AirdropType.ERC20) {
            require(token != address(0), "Invalid token address");
            require(IERC20(token).transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");
        } else if (airdropType == AirdropType.ERC1155) {
            require(token != address(0), "Invalid token address");
            IERC1155(token).safeTransferFrom(msg.sender, address(this), tokenId, totalAmount, "");
        }
        
        Airdrop storage airdrop = airdrops[airdropId];
        airdrop.airdropId = airdropId;
        airdrop.name = name;
        airdrop.airdropType = airdropType;
        airdrop.token = token;
        airdrop.tokenId = tokenId;
        airdrop.totalAmount = totalAmount;
        airdrop.amountPerClaim = amountPerClaim;
        airdrop.maxClaims = maxClaims;
        airdrop.status = AirdropStatus.Active;
        airdrop.startTime = block.timestamp;
        airdrop.endTime = block.timestamp + duration;
        airdrop.creator = msg.sender;
        airdrop.requireSocialVerification = requireSocialVerification;
        
        emit AirdropCreated(airdropId, msg.sender, name, airdropType, token, totalAmount);
        return airdropId;
    }
    
    /**
     * @dev Claim airdrop
     */
    function claimAirdrop(uint256 airdropId) external nonReentrant {
        Airdrop storage airdrop = airdrops[airdropId];
        require(airdrop.status == AirdropStatus.Active, "Airdrop not active");
        require(block.timestamp >= airdrop.startTime, "Airdrop not started");
        require(block.timestamp <= airdrop.endTime, "Airdrop expired");
        require(!airdrop.claimed[msg.sender], "Already claimed");
        require(airdrop.currentClaims < airdrop.maxClaims, "All tokens claimed");
        
        // Check social verification requirement
        if (airdrop.requireSocialVerification) {
            require(socialProfiles[msg.sender].verified, "Social verification required");
            require(socialProfiles[msg.sender].socialScore >= 100, "Insufficient social score");
        }
        
        airdrop.claimed[msg.sender] = true;
        airdrop.currentClaims++;
        
        // Transfer tokens
        if (airdrop.airdropType == AirdropType.ETH) {
            payable(msg.sender).transfer(airdrop.amountPerClaim);
        } else if (airdrop.airdropType == AirdropType.ERC20) {
            require(IERC20(airdrop.token).transfer(msg.sender, airdrop.amountPerClaim), "Transfer failed");
        } else if (airdrop.airdropType == AirdropType.ERC1155) {
            IERC1155(airdrop.token).safeTransferFrom(address(this), msg.sender, airdrop.tokenId, airdrop.amountPerClaim, "");
        }
        
        // Complete airdrop if all claimed
        if (airdrop.currentClaims >= airdrop.maxClaims) {
            airdrop.status = AirdropStatus.Completed;
        }
        
        emit AirdropClaimed(airdropId, msg.sender, airdrop.amountPerClaim);
    }
    
    /**
     * @dev Update social profile
     */
    function updateSocialProfile(
        string calldata farcasterHandle,
        string calldata lensHandle,
        string calldata twitterHandle,
        uint256 farcasterFollowers,
        uint256 lensFollowers,
        uint256 twitterFollowers
    ) external {
        SocialProfile storage profile = socialProfiles[msg.sender];
        
        profile.farcasterHandle = farcasterHandle;
        profile.lensHandle = lensHandle;
        profile.twitterHandle = twitterHandle;
        profile.farcasterFollowers = farcasterFollowers;
        profile.lensFollowers = lensFollowers;
        profile.twitterFollowers = twitterFollowers;
        profile.lastUpdated = block.timestamp;
        
        // Calculate social score (simplified)
        profile.socialScore = calculateSocialScore(farcasterFollowers, lensFollowers, twitterFollowers);
        
        emit SocialProfileUpdated(msg.sender, farcasterHandle, lensHandle, profile.socialScore);
    }
    
    /**
     * @dev Verify social profile (by authorized verifier)
     */
    function verifySocialProfile(address user, bool verified) external {
        require(socialVerifiers[msg.sender] || hasRole(OPERATOR_ROLE, msg.sender), "Not authorized verifier");
        socialProfiles[user].verified = verified;
    }
    
    /**
     * @dev Calculate social score
     */
    function calculateSocialScore(
        uint256 farcasterFollowers,
        uint256 lensFollowers,
        uint256 twitterFollowers
    ) public pure returns (uint256) {
        uint256 score = 0;
        
        // Farcaster scoring (50% weight)
        score += (farcasterFollowers / 10) * 50 / 100;
        
        // Lens scoring (30% weight)
        score += (lensFollowers / 10) * 30 / 100;
        
        // Twitter scoring (20% weight)
        score += (twitterFollowers / 100) * 20 / 100;
        
        // Cap at 1000
        return score > 1000 ? 1000 : score;
    }
    
    /**
     * @dev Create social quest
     */
    function createSocialQuest(
        string calldata title,
        string calldata description,
        uint256 reward,
        address rewardToken,
        uint256 rewardTokenId,
        string calldata requiredAction,
        string calldata platform,
        uint256 minFollowers,
        uint256 duration,
        uint256 maxParticipants
    ) external payable nonReentrant returns (uint256) {
        require(reward > 0, "Invalid reward");
        require(duration > 0, "Invalid duration");
        require(maxParticipants > 0, "Invalid max participants");
        
        uint256 questId = nextQuestId++;
        uint256 totalReward = reward * maxParticipants;
        
        // Handle funding
        if (rewardToken == address(0)) {
            require(msg.value >= totalReward, "Insufficient ETH sent");
        } else {
            require(IERC20(rewardToken).transferFrom(msg.sender, address(this), totalReward), "Transfer failed");
        }
        
        SocialQuest storage quest = socialQuests[questId];
        quest.questId = questId;
        quest.title = title;
        quest.description = description;
        quest.reward = reward;
        quest.rewardToken = rewardToken;
        quest.rewardTokenId = rewardTokenId;
        quest.requiredAction = requiredAction;
        quest.platform = platform;
        quest.minFollowers = minFollowers;
        quest.duration = duration;
        quest.maxParticipants = maxParticipants;
        quest.active = true;
        
        emit SocialQuestCreated(questId, title, platform, reward);
        return questId;
    }
    
    /**
     * @dev Complete social quest
     */
    function completeSocialQuest(uint256 questId) external nonReentrant {
        SocialQuest storage quest = socialQuests[questId];
        require(quest.active, "Quest not active");
        require(!quest.completed[msg.sender], "Already completed");
        require(quest.currentParticipants < quest.maxParticipants, "Quest full");
        
        SocialProfile storage profile = socialProfiles[msg.sender];
        require(profile.verified, "Social verification required");
        
        // Check minimum followers requirement
        uint256 totalFollowers = profile.farcasterFollowers + profile.lensFollowers + profile.twitterFollowers;
        require(totalFollowers >= quest.minFollowers, "Insufficient followers");
        
        quest.completed[msg.sender] = true;
        quest.currentParticipants++;
        
        // Distribute reward
        if (quest.rewardToken == address(0)) {
            payable(msg.sender).transfer(quest.reward);
        } else {
            require(IERC20(quest.rewardToken).transfer(msg.sender, quest.reward), "Transfer failed");
        }
        
        // Complete quest if max participants reached
        if (quest.currentParticipants >= quest.maxParticipants) {
            quest.active = false;
        }
        
        emit SocialQuestCompleted(questId, msg.sender, quest.reward);
    }
    
    /**
     * @dev Create a community
     */
    function createCommunity(
        string calldata name,
        string calldata description,
        address membershipToken,
        uint256 minTokenBalance,
        bool public_
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Invalid name");
        
        uint256 communityId = nextCommunityId++;
        
        Community storage community = communities[communityId];
        community.communityId = communityId;
        community.name = name;
        community.description = description;
        community.creator = msg.sender;
        community.membershipToken = membershipToken;
        community.minTokenBalance = minTokenBalance;
        community.public_ = public_;
        community.active = true;
        community.memberCount = 1;
        
        // Creator automatically becomes member and moderator
        community.members[msg.sender] = true;
        community.moderators[msg.sender] = true;
        
        emit CommunityCreated(communityId, msg.sender, name);
        return communityId;
    }
    
    /**
     * @dev Join a community
     */
    function joinCommunity(uint256 communityId) external {
        Community storage community = communities[communityId];
        require(community.active, "Community not active");
        require(!community.members[msg.sender], "Already a member");
        
        // Check membership requirements
        if (community.membershipToken != address(0)) {
            require(
                IERC20(community.membershipToken).balanceOf(msg.sender) >= community.minTokenBalance,
                "Insufficient token balance"
            );
        }
        
        community.members[msg.sender] = true;
        community.memberCount++;
        
        emit CommunityJoined(communityId, msg.sender);
    }
    
    /**
     * @dev Create a post in community
     */
    function createPost(
        uint256 communityId,
        string calldata content,
        string calldata mediaUri
    ) external returns (uint256) {
        Community storage community = communities[communityId];
        require(community.active, "Community not active");
        require(community.members[msg.sender], "Not a member");
        require(bytes(content).length > 0, "Empty content");
        
        uint256 postId = nextPostId++;
        
        Post storage post = posts[postId];
        post.postId = postId;
        post.communityId = communityId;
        post.author = msg.sender;
        post.content = content;
        post.mediaUri = mediaUri;
        post.timestamp = block.timestamp;
        
        emit PostCreated(postId, communityId, msg.sender, content);
        return postId;
    }
    
    /**
     * @dev Like a post
     */
    function likePost(uint256 postId) external {
        Post storage post = posts[postId];
        Community storage community = communities[post.communityId];
        
        require(community.active, "Community not active");
        require(community.members[msg.sender], "Not a member");
        require(!post.likedBy[msg.sender], "Already liked");
        
        post.likedBy[msg.sender] = true;
        post.likes++;
        
        emit PostLiked(postId, msg.sender);
    }
    
    /**
     * @dev Add whitelist to airdrop
     */
    function addToAirdropWhitelist(uint256 airdropId, address[] calldata users) external {
        Airdrop storage airdrop = airdrops[airdropId];
        require(msg.sender == airdrop.creator || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        
        for (uint256 i = 0; i < users.length; i++) {
            airdrop.whitelisted[users[i]] = true;
        }
    }
    
    /**
     * @dev Set social verifier
     */
    function setSocialVerifier(address verifier, bool authorized) external onlyRole(ADMIN_ROLE) {
        socialVerifiers[verifier] = authorized;
    }
    
    /**
     * @dev Get airdrop information
     */
    function getAirdropInfo(uint256 airdropId) external view returns (
        string memory name,
        AirdropType airdropType,
        address token,
        uint256 totalAmount,
        uint256 amountPerClaim,
        uint256 currentClaims,
        uint256 maxClaims,
        AirdropStatus status,
        uint256 startTime,
        uint256 endTime
    ) {
        Airdrop storage airdrop = airdrops[airdropId];
        return (
            airdrop.name,
            airdrop.airdropType,
            airdrop.token,
            airdrop.totalAmount,
            airdrop.amountPerClaim,
            airdrop.currentClaims,
            airdrop.maxClaims,
            airdrop.status,
            airdrop.startTime,
            airdrop.endTime
        );
    }
    
    /**
     * @dev Check if user claimed airdrop
     */
    function hasClaimedAirdrop(uint256 airdropId, address user) external view returns (bool) {
        return airdrops[airdropId].claimed[user];
    }
    
    /**
     * @dev Get community information
     */
    function getCommunityInfo(uint256 communityId) external view returns (
        string memory name,
        string memory description,
        address creator,
        uint256 memberCount,
        bool public_,
        bool active
    ) {
        Community storage community = communities[communityId];
        return (
            community.name,
            community.description,
            community.creator,
            community.memberCount,
            community.public_,
            community.active
        );
    }
    
    /**
     * @dev Check if user is community member
     */
    function isCommunityMember(uint256 communityId, address user) external view returns (bool) {
        return communities[communityId].members[user];
    }
    
    /**
     * @dev Get post information
     */
    function getPostInfo(uint256 postId) external view returns (
        uint256 communityId,
        address author,
        string memory content,
        string memory mediaUri,
        uint256 timestamp,
        uint256 likes,
        uint256 replies
    ) {
        Post storage post = posts[postId];
        return (
            post.communityId,
            post.author,
            post.content,
            post.mediaUri,
            post.timestamp,
            post.likes,
            post.replies
        );
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
    
    // Receive ETH for airdrops
    function depositETH() external payable {}
}