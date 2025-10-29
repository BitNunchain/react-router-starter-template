// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title DeFiModule
 * @dev Comprehensive DeFi module with liquidity pools, swaps, and yield farming
 */
contract DeFiModule is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    // Liquidity Pool structure
    struct LiquidityPool {
        uint256 poolId;
        address token0;
        address token1;
        uint256 reserve0;
        uint256 reserve1;
        uint256 totalLiquidity;
        uint256 fee; // Basis points (30 = 0.3%)
        bool active;
        mapping(address => uint256) liquidityShares;
    }
    
    // Yield Farm structure
    struct YieldFarm {
        uint256 farmId;
        address lpToken;
        address rewardToken;
        uint256 rewardPerBlock;
        uint256 startBlock;
        uint256 endBlock;
        uint256 totalStaked;
        uint256 accRewardPerShare;
        uint256 lastRewardBlock;
        bool active;
    }
    
    struct UserFarmInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pendingRewards;
    }
    
    // Lending Pool structure
    struct LendingPool {
        uint256 poolId;
        address asset;
        uint256 totalDeposits;
        uint256 totalBorrows;
        uint256 interestRate; // Annual rate in basis points
        uint256 collateralFactor; // Basis points (7500 = 75%)
        bool active;
        mapping(address => uint256) deposits;
        mapping(address => uint256) borrows;
        mapping(address => uint256) lastUpdateTime;
    }
    
    // Storage
    mapping(uint256 => LiquidityPool) public liquidityPools;
    mapping(uint256 => YieldFarm) public yieldFarms;
    mapping(uint256 => mapping(address => UserFarmInfo)) public userFarmInfo;
    mapping(uint256 => LendingPool) public lendingPools;
    
    // Pool lookups
    mapping(address => mapping(address => uint256)) public getPoolId; // token0 => token1 => poolId
    mapping(address => uint256) public assetToLendingPool; // asset => poolId
    
    uint256 public nextPoolId = 1;
    uint256 public nextFarmId = 1;
    uint256 public nextLendingPoolId = 1;
    
    // Platform settings
    uint256 public platformFeePercent = 5; // 5% of swap fees
    address public feeRecipient;
    
    // Price oracle (simplified)
    mapping(address => uint256) public tokenPrices; // token => price in wei
    
    // Events
    event PoolCreated(uint256 indexed poolId, address indexed token0, address indexed token1);
    event LiquidityAdded(uint256 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1);
    event LiquidityRemoved(uint256 indexed poolId, address indexed provider, uint256 amount0, uint256 amount1);
    event TokensSwapped(uint256 indexed poolId, address indexed user, address tokenIn, uint256 amountIn, uint256 amountOut);
    event YieldFarmCreated(uint256 indexed farmId, address indexed lpToken, address indexed rewardToken);
    event FarmDeposit(uint256 indexed farmId, address indexed user, uint256 amount);
    event FarmWithdraw(uint256 indexed farmId, address indexed user, uint256 amount);
    event RewardsClaimed(uint256 indexed farmId, address indexed user, uint256 rewards);
    event LendingPoolCreated(uint256 indexed poolId, address indexed asset);
    event Deposited(uint256 indexed poolId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed poolId, address indexed user, uint256 amount);
    event Borrowed(uint256 indexed poolId, address indexed user, uint256 amount);
    event Repaid(uint256 indexed poolId, address indexed user, uint256 amount);
    
    constructor(address _feeRecipient) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Create a new liquidity pool
     */
    function createPool(
        address token0,
        address token1,
        uint256 fee
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(token0 != token1, "Identical tokens");
        require(token0 != address(0) && token1 != address(0), "Zero address");
        require(fee <= 10000, "Fee too high"); // Max 100%
        
        // Ensure token0 < token1
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
        }
        
        require(getPoolId[token0][token1] == 0, "Pool already exists");
        
        uint256 poolId = nextPoolId++;
        
        LiquidityPool storage pool = liquidityPools[poolId];
        pool.poolId = poolId;
        pool.token0 = token0;
        pool.token1 = token1;
        pool.fee = fee;
        pool.active = true;
        
        getPoolId[token0][token1] = poolId;
        
        emit PoolCreated(poolId, token0, token1);
        return poolId;
    }
    
    /**
     * @dev Add liquidity to a pool
     */
    function addLiquidity(
        uint256 poolId,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant returns (uint256 liquidity) {
        LiquidityPool storage pool = liquidityPools[poolId];
        require(pool.active, "Pool not active");
        
        uint256 amount0;
        uint256 amount1;
        
        if (pool.reserve0 == 0 && pool.reserve1 == 0) {
            // First liquidity provision
            amount0 = amount0Desired;
            amount1 = amount1Desired;
            liquidity = sqrt(amount0 * amount1);
        } else {
            // Calculate optimal amounts
            uint256 amount1Optimal = (amount0Desired * pool.reserve1) / pool.reserve0;
            
            if (amount1Optimal <= amount1Desired) {
                require(amount1Optimal >= amount1Min, "Insufficient token1 amount");
                amount0 = amount0Desired;
                amount1 = amount1Optimal;
            } else {
                uint256 amount0Optimal = (amount1Desired * pool.reserve0) / pool.reserve1;
                require(amount0Optimal <= amount0Desired && amount0Optimal >= amount0Min, "Insufficient token0 amount");
                amount0 = amount0Optimal;
                amount1 = amount1Desired;
            }
            
            liquidity = min((amount0 * pool.totalLiquidity) / pool.reserve0, (amount1 * pool.totalLiquidity) / pool.reserve1);
        }
        
        require(liquidity > 0, "Insufficient liquidity minted");
        
        // Transfer tokens
        IERC20(pool.token0).transferFrom(msg.sender, address(this), amount0);
        IERC20(pool.token1).transferFrom(msg.sender, address(this), amount1);
        
        // Update pool state
        pool.reserve0 += amount0;
        pool.reserve1 += amount1;
        pool.totalLiquidity += liquidity;
        pool.liquidityShares[msg.sender] += liquidity;
        
        emit LiquidityAdded(poolId, msg.sender, amount0, amount1);
    }
    
    /**
     * @dev Remove liquidity from a pool
     */
    function removeLiquidity(
        uint256 poolId,
        uint256 liquidity,
        uint256 amount0Min,
        uint256 amount1Min
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        LiquidityPool storage pool = liquidityPools[poolId];
        require(pool.liquidityShares[msg.sender] >= liquidity, "Insufficient liquidity");
        
        // Calculate amounts
        amount0 = (liquidity * pool.reserve0) / pool.totalLiquidity;
        amount1 = (liquidity * pool.reserve1) / pool.totalLiquidity;
        
        require(amount0 >= amount0Min && amount1 >= amount1Min, "Insufficient output amount");
        
        // Update pool state
        pool.liquidityShares[msg.sender] -= liquidity;
        pool.totalLiquidity -= liquidity;
        pool.reserve0 -= amount0;
        pool.reserve1 -= amount1;
        
        // Transfer tokens
        IERC20(pool.token0).transfer(msg.sender, amount0);
        IERC20(pool.token1).transfer(msg.sender, amount1);
        
        emit LiquidityRemoved(poolId, msg.sender, amount0, amount1);
    }
    
    /**
     * @dev Swap tokens in a pool
     */
    function swapTokens(
        uint256 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOutMin,
        address to
    ) external nonReentrant returns (uint256 amountOut) {
        LiquidityPool storage pool = liquidityPools[poolId];
        require(pool.active, "Pool not active");
        require(tokenIn == pool.token0 || tokenIn == pool.token1, "Invalid token");
        require(to != address(0), "Invalid recipient");
        
        bool token0In = tokenIn == pool.token0;
        uint256 reserveIn = token0In ? pool.reserve0 : pool.reserve1;
        uint256 reserveOut = token0In ? pool.reserve1 : pool.reserve0;
        
        // Calculate output amount with fee
        uint256 amountInWithFee = amountIn * (10000 - pool.fee);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * 10000 + amountInWithFee);
        
        require(amountOut >= amountOutMin, "Insufficient output amount");
        require(amountOut < reserveOut, "Insufficient liquidity");
        
        // Transfer input token
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Update reserves
        if (token0In) {
            pool.reserve0 += amountIn;
            pool.reserve1 -= amountOut;
            IERC20(pool.token1).transfer(to, amountOut);
        } else {
            pool.reserve1 += amountIn;
            pool.reserve0 -= amountOut;
            IERC20(pool.token0).transfer(to, amountOut);
        }
        
        // Platform fee (taken from input)
        uint256 platformFee = (amountIn * pool.fee * platformFeePercent) / (10000 * 100);
        if (platformFee > 0) {
            IERC20(tokenIn).transfer(feeRecipient, platformFee);
        }
        
        emit TokensSwapped(poolId, msg.sender, tokenIn, amountIn, amountOut);
    }
    
    /**
     * @dev Create a yield farm
     */
    function createYieldFarm(
        address lpToken,
        address rewardToken,
        uint256 rewardPerBlock,
        uint256 startBlock,
        uint256 duration
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(lpToken != address(0) && rewardToken != address(0), "Invalid tokens");
        require(rewardPerBlock > 0, "Invalid reward rate");
        require(duration > 0, "Invalid duration");
        
        uint256 farmId = nextFarmId++;
        uint256 endBlock = startBlock + duration;
        
        YieldFarm storage farm = yieldFarms[farmId];
        farm.farmId = farmId;
        farm.lpToken = lpToken;
        farm.rewardToken = rewardToken;
        farm.rewardPerBlock = rewardPerBlock;
        farm.startBlock = startBlock;
        farm.endBlock = endBlock;
        farm.lastRewardBlock = startBlock;
        farm.active = true;
        
        emit YieldFarmCreated(farmId, lpToken, rewardToken);
        return farmId;
    }
    
    /**
     * @dev Deposit LP tokens to farm
     */
    function farmDeposit(uint256 farmId, uint256 amount) external nonReentrant {
        YieldFarm storage farm = yieldFarms[farmId];
        UserFarmInfo storage user = userFarmInfo[farmId][msg.sender];
        
        require(farm.active, "Farm not active");
        require(block.number >= farm.startBlock, "Farm not started");
        require(block.number < farm.endBlock, "Farm ended");
        
        _updateFarm(farmId);
        
        if (user.amount > 0) {
            uint256 pending = (user.amount * farm.accRewardPerShare) / 1e12 - user.rewardDebt;
            user.pendingRewards += pending;
        }
        
        IERC20(farm.lpToken).transferFrom(msg.sender, address(this), amount);
        
        user.amount += amount;
        farm.totalStaked += amount;
        user.rewardDebt = (user.amount * farm.accRewardPerShare) / 1e12;
        
        emit FarmDeposit(farmId, msg.sender, amount);
    }
    
    /**
     * @dev Withdraw LP tokens from farm
     */
    function farmWithdraw(uint256 farmId, uint256 amount) external nonReentrant {
        YieldFarm storage farm = yieldFarms[farmId];
        UserFarmInfo storage user = userFarmInfo[farmId][msg.sender];
        
        require(user.amount >= amount, "Insufficient staked amount");
        
        _updateFarm(farmId);
        
        uint256 pending = (user.amount * farm.accRewardPerShare) / 1e12 - user.rewardDebt;
        user.pendingRewards += pending;
        
        user.amount -= amount;
        farm.totalStaked -= amount;
        user.rewardDebt = (user.amount * farm.accRewardPerShare) / 1e12;
        
        IERC20(farm.lpToken).transfer(msg.sender, amount);
        
        emit FarmWithdraw(farmId, msg.sender, amount);
    }
    
    /**
     * @dev Claim farm rewards
     */
    function claimFarmRewards(uint256 farmId) external nonReentrant {
        YieldFarm storage farm = yieldFarms[farmId];
        UserFarmInfo storage user = userFarmInfo[farmId][msg.sender];
        
        _updateFarm(farmId);
        
        uint256 pending = (user.amount * farm.accRewardPerShare) / 1e12 - user.rewardDebt;
        uint256 totalRewards = user.pendingRewards + pending;
        
        require(totalRewards > 0, "No rewards to claim");
        
        user.pendingRewards = 0;
        user.rewardDebt = (user.amount * farm.accRewardPerShare) / 1e12;
        
        IERC20(farm.rewardToken).transfer(msg.sender, totalRewards);
        
        emit RewardsClaimed(farmId, msg.sender, totalRewards);
    }
    
    /**
     * @dev Update farm rewards
     */
    function _updateFarm(uint256 farmId) internal {
        YieldFarm storage farm = yieldFarms[farmId];
        
        if (block.number <= farm.lastRewardBlock) {
            return;
        }
        
        if (farm.totalStaked == 0) {
            farm.lastRewardBlock = block.number;
            return;
        }
        
        uint256 multiplier = getMultiplier(farm.lastRewardBlock, block.number, farm.endBlock);
        uint256 reward = multiplier * farm.rewardPerBlock;
        
        farm.accRewardPerShare += (reward * 1e12) / farm.totalStaked;
        farm.lastRewardBlock = block.number;
    }
    
    /**
     * @dev Get multiplier for reward calculation
     */
    function getMultiplier(uint256 from, uint256 to, uint256 endBlock) internal pure returns (uint256) {
        if (to <= endBlock) {
            return to - from;
        } else if (from >= endBlock) {
            return 0;
        } else {
            return endBlock - from;
        }
    }
    
    /**
     * @dev Create a lending pool
     */
    function createLendingPool(
        address asset,
        uint256 interestRate,
        uint256 collateralFactor
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(asset != address(0), "Invalid asset");
        require(assetToLendingPool[asset] == 0, "Pool already exists");
        require(collateralFactor <= 9000, "Collateral factor too high"); // Max 90%
        
        uint256 poolId = nextLendingPoolId++;
        
        LendingPool storage pool = lendingPools[poolId];
        pool.poolId = poolId;
        pool.asset = asset;
        pool.interestRate = interestRate;
        pool.collateralFactor = collateralFactor;
        pool.active = true;
        
        assetToLendingPool[asset] = poolId;
        
        emit LendingPoolCreated(poolId, asset);
        return poolId;
    }
    
    /**
     * @dev Deposit assets to lending pool
     */
    function lendingDeposit(uint256 poolId, uint256 amount) external nonReentrant {
        LendingPool storage pool = lendingPools[poolId];
        require(pool.active, "Pool not active");
        require(amount > 0, "Invalid amount");
        
        IERC20(pool.asset).transferFrom(msg.sender, address(this), amount);
        
        pool.deposits[msg.sender] += amount;
        pool.totalDeposits += amount;
        pool.lastUpdateTime[msg.sender] = block.timestamp;
        
        emit Deposited(poolId, msg.sender, amount);
    }
    
    /**
     * @dev Withdraw assets from lending pool
     */
    function lendingWithdraw(uint256 poolId, uint256 amount) external nonReentrant {
        LendingPool storage pool = lendingPools[poolId];
        require(pool.deposits[msg.sender] >= amount, "Insufficient deposit");
        
        // Calculate accrued interest
        uint256 interest = calculateInterest(poolId, msg.sender);
        uint256 totalWithdraw = amount + interest;
        
        require(IERC20(pool.asset).balanceOf(address(this)) >= totalWithdraw, "Insufficient liquidity");
        
        pool.deposits[msg.sender] -= amount;
        pool.totalDeposits -= amount;
        pool.lastUpdateTime[msg.sender] = block.timestamp;
        
        IERC20(pool.asset).transfer(msg.sender, totalWithdraw);
        
        emit Withdrawn(poolId, msg.sender, totalWithdraw);
    }
    
    /**
     * @dev Calculate accrued interest
     */
    function calculateInterest(uint256 poolId, address user) public view returns (uint256) {
        LendingPool storage pool = lendingPools[poolId];
        
        uint256 timeElapsed = block.timestamp - pool.lastUpdateTime[user];
        uint256 principal = pool.deposits[user];
        
        // Simple interest calculation (annual rate / seconds per year)
        uint256 interest = (principal * pool.interestRate * timeElapsed) / (10000 * 365 days);
        
        return interest;
    }
    
    /**
     * @dev Utility functions
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    /**
     * @dev Set token price (simplified oracle)
     */
    function setTokenPrice(address token, uint256 price) external onlyRole(OPERATOR_ROLE) {
        tokenPrices[token] = price;
    }
    
    /**
     * @dev Update platform fee
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyRole(ADMIN_ROLE) {
        require(newFeePercent <= 100, "Fee too high"); // Max 100%
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo(uint256 poolId) external view returns (
        address token0,
        address token1,
        uint256 reserve0,
        uint256 reserve1,
        uint256 totalLiquidity,
        uint256 fee,
        bool active
    ) {
        LiquidityPool storage pool = liquidityPools[poolId];
        return (
            pool.token0,
            pool.token1,
            pool.reserve0,
            pool.reserve1,
            pool.totalLiquidity,
            pool.fee,
            pool.active
        );
    }
    
    /**
     * @dev Get user's liquidity share
     */
    function getUserLiquidity(uint256 poolId, address user) external view returns (uint256) {
        return liquidityPools[poolId].liquidityShares[user];
    }
    
    /**
     * @dev Get farm information
     */
    function getFarmInfo(uint256 farmId) external view returns (YieldFarm memory) {
        return yieldFarms[farmId];
    }
    
    /**
     * @dev Get user farm information
     */
    function getUserFarmInfo(uint256 farmId, address user) external view returns (UserFarmInfo memory) {
        return userFarmInfo[farmId][user];
    }
}