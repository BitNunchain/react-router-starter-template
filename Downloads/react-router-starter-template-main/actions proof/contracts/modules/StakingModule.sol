// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/**
 * @title StakingModule
 * @dev Comprehensive staking system for tokens and NFTs with flexible reward mechanisms
 */
contract StakingModule is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Staking pool types
    enum PoolType { ERC20, ERC1155, LP_TOKEN }
    enum RewardType { FIXED, PERCENTAGE, DYNAMIC }
    
    struct StakingPool {
        uint256 poolId;
        string name;
        address stakingToken;
        uint256 stakingTokenId; // For ERC1155
        address rewardToken;
        PoolType poolType;
        RewardType rewardType;
        uint256 rewardRate; // Rewards per second
        uint256 lockPeriod; // Minimum staking period
        uint256 totalStaked;
        uint256 maxStake; // Maximum total stake allowed
        uint256 minStake; // Minimum individual stake
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool emergencyWithdraw;
    }
    
    struct UserStake {
        uint256 amount;
        uint256 stakedAt;
        uint256 lastClaimAt;
        uint256 totalRewardsClaimed;
        uint256 pendingRewards;
    }
    
    // Storage
    mapping(uint256 => StakingPool) public stakingPools;
    mapping(uint256 => mapping(address => UserStake)) public userStakes;
    mapping(address => uint256[]) public userPoolIds;
    
    uint256 public nextPoolId = 1;
    address public platformAddress;
    
    // Multipliers for different staking periods
    mapping(uint256 => uint256) public stakingMultipliers; // period => multiplier (basis points)
    
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed stakingToken,
        address indexed rewardToken,
        uint256 rewardRate
    );
    
    event Staked(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event Unstaked(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event RewardsClaimed(
        uint256 indexed poolId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event PoolUpdated(uint256 indexed poolId, uint256 newRewardRate);
    event EmergencyWithdrawEnabled(uint256 indexed poolId);
    
    constructor(address _platformAddress) {
        require(_platformAddress != address(0), "Invalid platform address");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        platformAddress = _platformAddress;
        
        // Set default multipliers
        stakingMultipliers[30 days] = 11000; // 10% bonus for 30 days
        stakingMultipliers[90 days] = 12500; // 25% bonus for 90 days
        stakingMultipliers[180 days] = 15000; // 50% bonus for 180 days
        stakingMultipliers[365 days] = 20000; // 100% bonus for 365 days
    }
    
    /**
     * @dev Create a new staking pool
     */
    function createPool(
        string calldata name,
        address stakingToken,
        uint256 stakingTokenId,
        address rewardToken,
        PoolType poolType,
        RewardType rewardType,
        uint256 rewardRate,
        uint256 lockPeriod,
        uint256 maxStake,
        uint256 minStake,
        uint256 duration
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(stakingToken != address(0), "Invalid staking token");
        require(rewardToken != address(0), "Invalid reward token");
        require(rewardRate > 0, "Invalid reward rate");
        require(duration > 0, "Invalid duration");
        
        uint256 poolId = nextPoolId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + duration;
        
        stakingPools[poolId] = StakingPool({
            poolId: poolId,
            name: name,
            stakingToken: stakingToken,
            stakingTokenId: stakingTokenId,
            rewardToken: rewardToken,
            poolType: poolType,
            rewardType: rewardType,
            rewardRate: rewardRate,
            lockPeriod: lockPeriod,
            totalStaked: 0,
            maxStake: maxStake,
            minStake: minStake,
            startTime: startTime,
            endTime: endTime,
            active: true,
            emergencyWithdraw: false
        });
        
        emit PoolCreated(poolId, stakingToken, rewardToken, rewardRate);
        return poolId;
    }
    
    /**
     * @dev Stake tokens in a pool
     */
    function stake(uint256 poolId, uint256 amount) external nonReentrant {
        StakingPool storage pool = stakingPools[poolId];
        require(pool.active, "Pool not active");
        require(block.timestamp >= pool.startTime, "Pool not started");
        require(block.timestamp < pool.endTime, "Pool ended");
        require(amount >= pool.minStake, "Amount below minimum");
        
        UserStake storage userStake = userStakes[poolId][msg.sender];
        
        // Check maximum stake limit
        if (pool.maxStake > 0) {
            require(pool.totalStaked + amount <= pool.maxStake, "Exceeds max stake");
        }
        
        // Update pending rewards before staking
        _updatePendingRewards(poolId, msg.sender);
        
        // Transfer tokens to contract
        if (pool.poolType == PoolType.ERC20 || pool.poolType == PoolType.LP_TOKEN) {
            require(IERC20(pool.stakingToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        } else if (pool.poolType == PoolType.ERC1155) {
            IERC1155(pool.stakingToken).safeTransferFrom(msg.sender, address(this), pool.stakingTokenId, amount, "");
        }
        
        // Update user stake
        if (userStake.amount == 0) {
            userPoolIds[msg.sender].push(poolId);
            userStake.stakedAt = block.timestamp;
            userStake.lastClaimAt = block.timestamp;
        }
        
        userStake.amount += amount;
        pool.totalStaked += amount;
        
        emit Staked(poolId, msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Unstake tokens from a pool
     */
    function unstake(uint256 poolId, uint256 amount) external nonReentrant {
        StakingPool storage pool = stakingPools[poolId];
        UserStake storage userStake = userStakes[poolId][msg.sender];
        
        require(userStake.amount >= amount, "Insufficient staked amount");
        
        // Check lock period
        if (!pool.emergencyWithdraw) {
            require(block.timestamp >= userStake.stakedAt + pool.lockPeriod, "Still locked");
        }
        
        // Update and claim pending rewards
        _updatePendingRewards(poolId, msg.sender);
        if (userStake.pendingRewards > 0) {
            _claimRewards(poolId, msg.sender);
        }
        
        // Update user stake
        userStake.amount -= amount;
        pool.totalStaked -= amount;
        
        // Transfer tokens back to user
        if (pool.poolType == PoolType.ERC20 || pool.poolType == PoolType.LP_TOKEN) {
            require(IERC20(pool.stakingToken).transfer(msg.sender, amount), "Transfer failed");
        } else if (pool.poolType == PoolType.ERC1155) {
            IERC1155(pool.stakingToken).safeTransferFrom(address(this), msg.sender, pool.stakingTokenId, amount, "");
        }
        
        emit Unstaked(poolId, msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Claim pending rewards
     */
    function claimRewards(uint256 poolId) external nonReentrant {
        _updatePendingRewards(poolId, msg.sender);
        _claimRewards(poolId, msg.sender);
    }
    
    /**
     * @dev Internal function to update pending rewards
     */
    function _updatePendingRewards(uint256 poolId, address user) internal {
        StakingPool storage pool = stakingPools[poolId];
        UserStake storage userStake = userStakes[poolId][user];
        
        if (userStake.amount == 0) return;
        
        uint256 currentTime = block.timestamp;
        if (currentTime > pool.endTime) {
            currentTime = pool.endTime;
        }
        
        uint256 timeSinceLastClaim = currentTime - userStake.lastClaimAt;
        if (timeSinceLastClaim == 0) return;
        
        uint256 baseReward = (userStake.amount * pool.rewardRate * timeSinceLastClaim) / 1e18;
        
        // Apply staking duration multiplier
        uint256 stakingDuration = currentTime - userStake.stakedAt;
        uint256 multiplier = _getStakingMultiplier(stakingDuration);
        uint256 totalReward = (baseReward * multiplier) / 10000;
        
        userStake.pendingRewards += totalReward;
        userStake.lastClaimAt = currentTime;
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(uint256 poolId, address user) internal {
        StakingPool storage pool = stakingPools[poolId];
        UserStake storage userStake = userStakes[poolId][user];
        
        uint256 rewards = userStake.pendingRewards;
        if (rewards == 0) return;
        
        userStake.pendingRewards = 0;
        userStake.totalRewardsClaimed += rewards;
        
        // Transfer reward tokens
        require(IERC20(pool.rewardToken).transfer(user, rewards), "Reward transfer failed");
        
        emit RewardsClaimed(poolId, user, rewards, block.timestamp);
    }
    
    /**
     * @dev Get staking multiplier based on duration
     */
    function _getStakingMultiplier(uint256 duration) internal view returns (uint256) {
        if (duration >= 365 days) return stakingMultipliers[365 days];
        if (duration >= 180 days) return stakingMultipliers[180 days];
        if (duration >= 90 days) return stakingMultipliers[90 days];
        if (duration >= 30 days) return stakingMultipliers[30 days];
        return 10000; // Base multiplier (no bonus)
    }
    
    /**
     * @dev Calculate pending rewards for a user
     */
    function getPendingRewards(uint256 poolId, address user) external view returns (uint256) {
        StakingPool storage pool = stakingPools[poolId];
        UserStake storage userStake = userStakes[poolId][user];
        
        if (userStake.amount == 0) return userStake.pendingRewards;
        
        uint256 currentTime = block.timestamp;
        if (currentTime > pool.endTime) {
            currentTime = pool.endTime;
        }
        
        uint256 timeSinceLastClaim = currentTime - userStake.lastClaimAt;
        uint256 baseReward = (userStake.amount * pool.rewardRate * timeSinceLastClaim) / 1e18;
        
        // Apply staking duration multiplier
        uint256 stakingDuration = currentTime - userStake.stakedAt;
        uint256 multiplier = _getStakingMultiplier(stakingDuration);
        uint256 newReward = (baseReward * multiplier) / 10000;
        
        return userStake.pendingRewards + newReward;
    }
    
    /**
     * @dev Update pool parameters
     */
    function updatePool(
        uint256 poolId,
        uint256 newRewardRate,
        uint256 newEndTime
    ) external onlyRole(ADMIN_ROLE) {
        StakingPool storage pool = stakingPools[poolId];
        require(pool.active, "Pool not active");
        
        pool.rewardRate = newRewardRate;
        if (newEndTime > block.timestamp) {
            pool.endTime = newEndTime;
        }
        
        emit PoolUpdated(poolId, newRewardRate);
    }
    
    /**
     * @dev Set staking multiplier
     */
    function setStakingMultiplier(uint256 period, uint256 multiplier) external onlyRole(ADMIN_ROLE) {
        require(multiplier >= 10000, "Multiplier too low"); // At least 100%
        stakingMultipliers[period] = multiplier;
    }
    
    /**
     * @dev Enable emergency withdraw for a pool
     */
    function enableEmergencyWithdraw(uint256 poolId) external onlyRole(ADMIN_ROLE) {
        stakingPools[poolId].emergencyWithdraw = true;
        emit EmergencyWithdrawEnabled(poolId);
    }
    
    /**
     * @dev Pause/unpause a pool
     */
    function togglePool(uint256 poolId) external onlyRole(ADMIN_ROLE) {
        stakingPools[poolId].active = !stakingPools[poolId].active;
    }
    
    /**
     * @dev Get user's staked pools
     */
    function getUserPools(address user) external view returns (uint256[] memory) {
        return userPoolIds[user];
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo(uint256 poolId) external view returns (StakingPool memory) {
        return stakingPools[poolId];
    }
    
    /**
     * @dev Get user stake information
     */
    function getUserStake(uint256 poolId, address user) external view returns (UserStake memory) {
        return userStakes[poolId][user];
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
}