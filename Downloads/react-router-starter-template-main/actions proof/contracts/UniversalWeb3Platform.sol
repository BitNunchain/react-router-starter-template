// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./modules/TokenModule.sol";
import "./modules/MarketplaceModule.sol";
import "./modules/StakingModule.sol";
import "./modules/GovernanceModule.sol";
import "./modules/DeFiModule.sol";
import "./modules/SocialModule.sol";

/**
 * @title UniversalWeb3Platform
 * @dev A comprehensive Web3 platform that combines all major DeFi and NFT functionalities
 * @notice This contract acts as a central hub connecting various specialized modules
 */
contract UniversalWeb3Platform is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Module contracts
    TokenModule public tokenModule;
    MarketplaceModule public marketplaceModule;
    StakingModule public stakingModule;
    GovernanceModule public governanceModule;
    DeFiModule public defiModule;
    SocialModule public socialModule;
    
    // Platform settings
    struct PlatformConfig {
        uint256 platformFeePercent; // Basis points (100 = 1%)
        address feeRecipient;
        bool isInitialized;
    }
    
    PlatformConfig public platformConfig;
    
    // Events
    event ModuleUpdated(string moduleName, address oldModule, address newModule);
    event PlatformConfigUpdated(uint256 feePercent, address feeRecipient);
    event EmergencyWithdraw(address token, uint256 amount, address to);
    
    constructor(
        address _admin,
        uint256 _platformFeePercent,
        address _feeRecipient
    ) {
        require(_admin != address(0), "Invalid admin address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        require(_platformFeePercent <= 1000, "Fee too high"); // Max 10%
        
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
        
        platformConfig = PlatformConfig({
            platformFeePercent: _platformFeePercent,
            feeRecipient: _feeRecipient,
            isInitialized: true
        });
    }
    
    /**
     * @dev Initialize all modules after deployment
     */
    function initializeModules(
        address _tokenModule,
        address _marketplaceModule,
        address _stakingModule,
        address payable _governanceModule,
        address _defiModule,
        address payable _socialModule
    ) external onlyRole(ADMIN_ROLE) {
        require(!platformConfig.isInitialized || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Already initialized");
        
        tokenModule = TokenModule(_tokenModule);
        marketplaceModule = MarketplaceModule(_marketplaceModule);
        stakingModule = StakingModule(_stakingModule);
        governanceModule = GovernanceModule(_governanceModule);
        defiModule = DeFiModule(_defiModule);
        socialModule = SocialModule(_socialModule);
        
        platformConfig.isInitialized = true;
    }
    
    /**
     * @dev Update a specific module
     */
    function updateModule(
        string calldata moduleName,
        address payable newModule
    ) external onlyRole(ADMIN_ROLE) {
        require(newModule != address(0), "Invalid module address");
        
        bytes32 moduleHash = keccak256(bytes(moduleName));
        address oldModule;
        
        if (moduleHash == keccak256("token")) {
            oldModule = address(tokenModule);
            tokenModule = TokenModule(newModule);
        } else if (moduleHash == keccak256("marketplace")) {
            oldModule = address(marketplaceModule);
            marketplaceModule = MarketplaceModule(newModule);
        } else if (moduleHash == keccak256("staking")) {
            oldModule = address(stakingModule);
            stakingModule = StakingModule(newModule);
        } else if (moduleHash == keccak256("governance")) {
            oldModule = address(governanceModule);
            governanceModule = GovernanceModule(newModule);
        } else if (moduleHash == keccak256("defi")) {
            oldModule = address(defiModule);
            defiModule = DeFiModule(newModule);
        } else if (moduleHash == keccak256("social")) {
            oldModule = address(socialModule);
            socialModule = SocialModule(newModule);
        } else {
            revert("Invalid module name");
        }
        
        emit ModuleUpdated(moduleName, oldModule, newModule);
    }
    
    /**
     * @dev Update platform configuration
     */
    function updatePlatformConfig(
        uint256 _platformFeePercent,
        address _feeRecipient
    ) external onlyRole(ADMIN_ROLE) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        require(_platformFeePercent <= 1000, "Fee too high");
        
        platformConfig.platformFeePercent = _platformFeePercent;
        platformConfig.feeRecipient = _feeRecipient;
        
        emit PlatformConfigUpdated(_platformFeePercent, _feeRecipient);
    }
    
    /**
     * @dev Pause all platform operations
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause platform operations
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw function
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(to != address(0), "Invalid recipient");
        
        if (token == address(0)) {
            // Withdraw ETH
            payable(to).transfer(amount);
        } else {
            // Withdraw ERC20
            IERC20(token).transfer(to, amount);
        }
        
        emit EmergencyWithdraw(token, amount, to);
    }
    
    /**
     * @dev Get all module addresses
     */
    function getModules() external view returns (
        address token,
        address marketplace,
        address staking,
        address governance,
        address defi,
        address social
    ) {
        return (
            address(tokenModule),
            address(marketplaceModule),
            address(stakingModule),
            address(governanceModule),
            address(defiModule),
            address(socialModule)
        );
    }
    
    /**
     * @dev Check if platform is fully initialized
     */
    function isFullyInitialized() external view returns (bool) {
        return platformConfig.isInitialized &&
               address(tokenModule) != address(0) &&
               address(marketplaceModule) != address(0) &&
               address(stakingModule) != address(0) &&
               address(governanceModule) != address(0) &&
               address(defiModule) != address(0) &&
               address(socialModule) != address(0);
    }
    
    // Receive ETH
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}