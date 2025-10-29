const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("\n" + "=".repeat(80));
    console.log("🚀 DEPLOYING UNIVERSAL WEB3 PLATFORM TO POLYGON MAINNET");
    console.log("=".repeat(80));
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance < ethers.parseEther("3")) {
        console.log("⚠️  WARNING: Low MATIC balance. Recommended: 5+ MATIC for deployment");
    }
    
    // Deployment configuration for Polygon
    const config = {
        platformFeePercent: 250, // 2.5%
        feeRecipient: deployer.address, // Your wallet receives platform fees
        admin: deployer.address, // Your wallet is admin
        network: "Polygon Mainnet",
        chainId: 137
    };
    
    console.log("\n📋 Deployment Configuration:");
    console.log("   • Platform Fee:", config.platformFeePercent / 100, "%");
    console.log("   • Fee Recipient:", config.feeRecipient);
    console.log("   • Admin Address:", config.admin);
    console.log("   • Network:", config.network);
    
    const deploymentResults = {};
    
    try {
        // 1. Deploy Main Platform Contract
        console.log("\n🏗️  Step 1/7: Deploying UniversalWeb3Platform...");
        const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
        const platform = await UniversalWeb3Platform.deploy(
            config.admin,
            config.platformFeePercent,
            config.feeRecipient
        );
        await platform.waitForDeployment();
        deploymentResults.platform = await platform.getAddress();
        console.log("✅ UniversalWeb3Platform:", deploymentResults.platform);
        
        // 2. Deploy TokenModule
        console.log("\n🎨 Step 2/7: Deploying TokenModule...");
        const TokenModule = await ethers.getContractFactory("TokenModule");
        const tokenModule = await TokenModule.deploy(
            "Universal Web3 Platform",
            "1.0",
            deploymentResults.platform
        );
        await tokenModule.waitForDeployment();
        deploymentResults.tokenModule = await tokenModule.getAddress();
        console.log("✅ TokenModule:", deploymentResults.tokenModule);
        
        // 3. Deploy MarketplaceModule
        console.log("\n🛒 Step 3/7: Deploying MarketplaceModule...");
        const MarketplaceModule = await ethers.getContractFactory("MarketplaceModule");
        const marketplaceModule = await MarketplaceModule.deploy(
            config.feeRecipient,
            deploymentResults.platform
        );
        await marketplaceModule.waitForDeployment();
        deploymentResults.marketplaceModule = await marketplaceModule.getAddress();
        console.log("✅ MarketplaceModule:", deploymentResults.marketplaceModule);
        
        // 4. Deploy GovernanceToken (needed for governance)
        console.log("\n🏛️  Step 4/7: Deploying Governance Token...");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const governanceToken = await MockERC20.deploy(
            "Universal Platform Token",
            "UPT",
            ethers.parseEther("100000000") // 100M tokens
        );
        await governanceToken.waitForDeployment();
        deploymentResults.governanceToken = await governanceToken.getAddress();
        console.log("✅ Governance Token:", deploymentResults.governanceToken);
        
        // 5. Deploy StakingModule
        console.log("\n💰 Step 5/7: Deploying StakingModule...");
        const StakingModule = await ethers.getContractFactory("StakingModule");
        const stakingModule = await StakingModule.deploy(deploymentResults.platform);
        await stakingModule.waitForDeployment();
        deploymentResults.stakingModule = await stakingModule.getAddress();
        console.log("✅ StakingModule:", deploymentResults.stakingModule);
        
        // 6. Deploy GovernanceModule
        console.log("\n🗳️  Step 6/7: Deploying GovernanceModule...");
        const GovernanceModule = await ethers.getContractFactory("GovernanceModule");
        const governanceModule = await GovernanceModule.deploy(
            deploymentResults.governanceToken,
            1, // votingDelay (1 block)
            17280, // votingPeriod (3 days in blocks)
            ethers.parseEther("10000"), // proposalThreshold (10K tokens)
            ethers.parseEther("100000"), // quorumVotes (100K tokens)
            172800 // timelockDelay (2 days in seconds)
        );
        await governanceModule.waitForDeployment();
        deploymentResults.governanceModule = await governanceModule.getAddress();
        console.log("✅ GovernanceModule:", deploymentResults.governanceModule);
        
        // 7. Deploy DeFiModule
        console.log("\n🔄 Step 7/7: Deploying DeFiModule...");
        const DeFiModule = await ethers.getContractFactory("DeFiModule");
        const defiModule = await DeFiModule.deploy(config.feeRecipient);
        await defiModule.waitForDeployment();
        deploymentResults.defiModule = await defiModule.getAddress();
        console.log("✅ DeFiModule:", deploymentResults.defiModule);
        
        // 8. Deploy SocialModule
        console.log("\n🌐 Step 8/8: Deploying SocialModule...");
        const SocialModule = await ethers.getContractFactory("SocialModule");
        const socialModule = await SocialModule.deploy(
            "Universal Web3 Platform Social",
            "1.0",
            deploymentResults.platform
        );
        await socialModule.waitForDeployment();
        deploymentResults.socialModule = await socialModule.getAddress();
        console.log("✅ SocialModule:", deploymentResults.socialModule);
        
        // 9. Initialize Platform
        console.log("\n🔗 Step 9/9: Initializing Platform with all modules...");
        const initTx = await platform.initializeModules(
            deploymentResults.tokenModule,
            deploymentResults.marketplaceModule,
            deploymentResults.stakingModule,
            deploymentResults.governanceModule,
            deploymentResults.defiModule,
            deploymentResults.socialModule
        );
        await initTx.wait();
        console.log("✅ Platform initialized with all modules!");
        
        // 10. Verify deployment
        console.log("\n✅ Verifying deployment...");
        const isInitialized = await platform.isFullyInitialized();
        if (!isInitialized) {
            throw new Error("Platform initialization failed!");
        }
        console.log("✅ Platform fully initialized and verified!");
        
        // 11. Setup roles and permissions
        console.log("\n🔐 Setting up roles and permissions...");
        const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
        const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
        
        // Grant platform admin rights to modules
        await tokenModule.grantRole(ADMIN_ROLE, deploymentResults.platform);
        await marketplaceModule.grantRole(ADMIN_ROLE, deploymentResults.platform);
        await stakingModule.grantRole(ADMIN_ROLE, deploymentResults.platform);
        await defiModule.grantRole(ADMIN_ROLE, deploymentResults.platform);
        await socialModule.grantRole(ADMIN_ROLE, deploymentResults.platform);
        
        console.log("✅ Roles and permissions configured!");
        
        // Create deployment summary
        const deploymentInfo = {
            network: "Polygon Mainnet",
            chainId: 137,
            deployer: deployer.address,
            deploymentTime: new Date().toISOString(),
            gasUsed: "~3-5 MATIC",
            contracts: deploymentResults,
            configuration: config,
            platformFeatures: [
                "Multi-standard token support (ERC20, ERC721, ERC1155)",
                "Complete marketplace with auctions and offers", 
                "Advanced staking with multipliers and rewards",
                "Comprehensive governance system with timelock",
                "DeFi pools, swaps, and yield farming",
                "Social features, airdrops, and communities"
            ],
            nextSteps: [
                "Verify contracts on PolygonScan",
                "Set up monitoring and alerts",
                "Create frontend integration",
                "Launch marketing campaign"
            ]
        };
        
        // Save deployment info
        const timestamp = Date.now();
        const filename = `polygon-mainnet-deployment-${timestamp}.json`;
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        
        console.log("\n" + "=".repeat(80));
        console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY ON POLYGON MAINNET!");
        console.log("=".repeat(80));
        console.log("\n📋 CONTRACT ADDRESSES:");
        console.log("┌─────────────────────────┬──────────────────────────────────────────────┐");
        console.log("│ Contract                │ Address                                      │");
        console.log("├─────────────────────────┼──────────────────────────────────────────────┤");
        console.log(`│ UniversalWeb3Platform   │ ${deploymentResults.platform}        │`);
        console.log(`│ TokenModule             │ ${deploymentResults.tokenModule}        │`);
        console.log(`│ MarketplaceModule       │ ${deploymentResults.marketplaceModule}        │`);
        console.log(`│ StakingModule           │ ${deploymentResults.stakingModule}        │`);
        console.log(`│ GovernanceModule        │ ${deploymentResults.governanceModule}        │`);
        console.log(`│ GovernanceToken         │ ${deploymentResults.governanceToken}        │`);
        console.log(`│ DeFiModule              │ ${deploymentResults.defiModule}        │`);
        console.log(`│ SocialModule            │ ${deploymentResults.socialModule}        │`);
        console.log("└─────────────────────────┴──────────────────────────────────────────────┘");
        
        console.log("\n🔗 USEFUL LINKS:");
        console.log("• PolygonScan:", `https://polygonscan.com/address/${deploymentResults.platform}`);
        console.log("• OpenSea:", `https://opensea.io/assets/matic/${deploymentResults.tokenModule}`);
        console.log("• Documentation:", "https://docs.polygon.technology/");
        
        console.log("\n📊 PLATFORM CAPABILITIES:");
        deploymentInfo.platformFeatures.forEach(feature => {
            console.log(`   ✅ ${feature}`);
        });
        
        console.log("\n🚀 NEXT STEPS:");
        deploymentInfo.nextSteps.forEach((step, index) => {
            console.log(`   ${index + 1}. ${step}`);
        });
        
        console.log(`\n💾 Deployment info saved to: ${filename}`);
        console.log("\n🎯 Your Universal Web3 Platform is now LIVE on Polygon Mainnet!");
        console.log("🌟 You can now create NFTs, run marketplaces, manage DeFi, and build communities!");
        
        return deploymentInfo;
        
    } catch (error) {
        console.error("\n❌ DEPLOYMENT FAILED:");
        console.error("Error:", error.message);
        console.error("\n🔧 Troubleshooting:");
        console.error("1. Check your MATIC balance");
        console.error("2. Verify network connection");
        console.error("3. Ensure private key is correct");
        console.error("4. Try increasing gas limit");
        throw error;
    }
}

// Execute deployment
main()
    .then((result) => {
        console.log("\n🎊 POLYGON MAINNET DEPLOYMENT SUCCESSFUL!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 DEPLOYMENT FAILED:", error);
        process.exit(1);
    });