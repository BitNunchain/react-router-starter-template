const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Universal Web3 Platform...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    // Deployment configuration
    const platformFeePercent = 250; // 2.5%
    const feeRecipient = deployer.address; // Use deployer as initial fee recipient
    
    // Deploy main platform contract
    console.log("\n1. Deploying UniversalWeb3Platform...");
    const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
    const platform = await UniversalWeb3Platform.deploy(
        deployer.address, // admin
        platformFeePercent,
        feeRecipient
    );
    await platform.deployed();
    console.log("UniversalWeb3Platform deployed to:", platform.address);
    
    // Deploy TokenModule
    console.log("\n2. Deploying TokenModule...");
    const TokenModule = await ethers.getContractFactory("TokenModule");
    const tokenModule = await TokenModule.deploy(
        "Universal Web3 Platform",
        "1",
        platform.address
    );
    await tokenModule.deployed();
    console.log("TokenModule deployed to:", tokenModule.address);
    
    // Deploy MarketplaceModule
    console.log("\n3. Deploying MarketplaceModule...");
    const MarketplaceModule = await ethers.getContractFactory("MarketplaceModule");
    const marketplaceModule = await MarketplaceModule.deploy(
        feeRecipient,
        platform.address
    );
    await marketplaceModule.deployed();
    console.log("MarketplaceModule deployed to:", marketplaceModule.address);
    
    // Deploy StakingModule
    console.log("\n4. Deploying StakingModule...");
    const StakingModule = await ethers.getContractFactory("StakingModule");
    const stakingModule = await StakingModule.deploy(platform.address);
    await stakingModule.deployed();
    console.log("StakingModule deployed to:", stakingModule.address);
    
    // Deploy GovernanceModule (we need a governance token first)
    console.log("\n5. Deploying GovernanceModule...");
    // For demo purposes, we'll use a simple ERC20 token as governance token
    const ERC20 = await ethers.getContractFactory("ERC20");
    
    // Create a simple governance token contract
    const GovernanceToken = await ethers.getContractFactory("contracts/test/MockERC20.sol:MockERC20");
    const governanceToken = await GovernanceToken.deploy("Platform Governance Token", "PGT", ethers.utils.parseEther("1000000"));
    await governanceToken.deployed();
    console.log("GovernanceToken deployed to:", governanceToken.address);
    
    const GovernanceModule = await ethers.getContractFactory("GovernanceModule");
    const governanceModule = await GovernanceModule.deploy(
        governanceToken.address,
        1, // votingDelay (1 block)
        17280, // votingPeriod (3 days in blocks)
        ethers.utils.parseEther("1000"), // proposalThreshold
        ethers.utils.parseEther("10000"), // quorumVotes
        172800 // timelockDelay (2 days in seconds)
    );
    await governanceModule.deployed();
    console.log("GovernanceModule deployed to:", governanceModule.address);
    
    // Deploy DeFiModule
    console.log("\n6. Deploying DeFiModule...");
    const DeFiModule = await ethers.getContractFactory("DeFiModule");
    const defiModule = await DeFiModule.deploy(feeRecipient);
    await defiModule.deployed();
    console.log("DeFiModule deployed to:", defiModule.address);
    
    // Deploy SocialModule
    console.log("\n7. Deploying SocialModule...");
    const SocialModule = await ethers.getContractFactory("SocialModule");
    const socialModule = await SocialModule.deploy(
        "Universal Web3 Platform Social",
        "1",
        platform.address
    );
    await socialModule.deployed();
    console.log("SocialModule deployed to:", socialModule.address);
    
    // Initialize modules in main platform
    console.log("\n8. Initializing modules in main platform...");
    await platform.initializeModules(
        tokenModule.address,
        marketplaceModule.address,
        stakingModule.address,
        governanceModule.address,
        defiModule.address,
        socialModule.address
    );
    console.log("Modules initialized successfully!");
    
    // Grant necessary roles
    console.log("\n9. Setting up roles and permissions...");
    
    // Grant roles to platform contract
    const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
    const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    const OPERATOR_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("OPERATOR_ROLE"));
    
    await tokenModule.grantRole(ADMIN_ROLE, platform.address);
    await marketplaceModule.grantRole(ADMIN_ROLE, platform.address);
    await stakingModule.grantRole(ADMIN_ROLE, platform.address);
    await defiModule.grantRole(ADMIN_ROLE, platform.address);
    await socialModule.grantRole(ADMIN_ROLE, platform.address);
    
    console.log("Roles configured successfully!");
    
    // Verify deployment
    console.log("\n10. Verifying deployment...");
    const isInitialized = await platform.isFullyInitialized();
    console.log("Platform fully initialized:", isInitialized);
    
    const modules = await platform.getModules();
    console.log("Module addresses:", {
        token: modules.token,
        marketplace: modules.marketplace,
        staking: modules.staking,
        governance: modules.governance,
        defi: modules.defi,
        social: modules.social
    });
    
    // Save deployment info
    const deploymentInfo = {
        network: network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            UniversalWeb3Platform: platform.address,
            TokenModule: tokenModule.address,
            MarketplaceModule: marketplaceModule.address,
            StakingModule: stakingModule.address,
            GovernanceModule: governanceModule.address,
            GovernanceToken: governanceToken.address,
            DeFiModule: defiModule.address,
            SocialModule: socialModule.address
        },
        config: {
            platformFeePercent,
            feeRecipient
        }
    };
    
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("Main Platform:", platform.address);
    console.log("All modules deployed and initialized");
    console.log("Save this deployment info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));
    
    return deploymentInfo;
}

main()
    .then((deploymentInfo) => {
        // Write deployment info to file
        const fs = require("fs");
        const path = require("path");
        
        const deploymentsDir = path.join(__dirname, "../deployments");
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir);
        }
        
        const filename = `deployment-${network.name}-${Date.now()}.json`;
        fs.writeFileSync(
            path.join(deploymentsDir, filename),
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log(`\nDeployment info saved to: deployments/${filename}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });