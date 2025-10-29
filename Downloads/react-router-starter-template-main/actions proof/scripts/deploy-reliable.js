const { ethers } = require("hardhat");

async function deployWithRetry(contractFactory, args, contractName, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🔄 Deploying ${contractName}... (Attempt ${i + 1}/${retries})`);
            
            const contract = await contractFactory.deploy(...args, {
                gasLimit: 5000000, // Conservative gas limit
                maxFeePerGas: ethers.parseUnits("100", "gwei"), // Higher max fee
                maxPriorityFeePerGas: ethers.parseUnits("50", "gwei"), // Higher priority fee
            });
            
            console.log(`⏳ Waiting for ${contractName} to be mined...`);
            await contract.waitForDeployment();
            
            const address = await contract.getAddress();
            console.log(`✅ ${contractName} deployed at: ${address}`);
            
            return { contract, address };
        } catch (error) {
            console.log(`❌ Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            
            console.log("⏳ Waiting 10 seconds before retry...");
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 POLYGON MAINNET DEPLOYMENT - RELIABLE VERSION");
    console.log("=".repeat(60));
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deployer:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");
    
    // Check current gas price
    try {
        const feeData = await ethers.provider.getFeeData();
        console.log("⛽ Current gas price:", ethers.formatUnits(feeData.gasPrice || 0, "gwei"), "gwei");
    } catch (e) {
        console.log("⛽ Could not fetch gas price, using defaults");
    }
    
    const deploymentResults = {};
    
    try {
        // Step 1: Deploy Main Platform
        console.log("\n🏗️  STEP 1: Deploying UniversalWeb3Platform");
        const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
        const platformResult = await deployWithRetry(
            UniversalWeb3Platform,
            [deployer.address, 250, deployer.address],
            "UniversalWeb3Platform"
        );
        deploymentResults.platform = platformResult.address;
        
        // Step 2: Deploy Token Module
        console.log("\n🎨 STEP 2: Deploying TokenModule");
        const TokenModule = await ethers.getContractFactory("TokenModule");
        const tokenResult = await deployWithRetry(
            TokenModule,
            ["Universal Web3 Platform", "1.0", deploymentResults.platform],
            "TokenModule"
        );
        deploymentResults.tokenModule = tokenResult.address;
        
        // Step 3: Deploy Marketplace Module
        console.log("\n🛒 STEP 3: Deploying MarketplaceModule");
        const MarketplaceModule = await ethers.getContractFactory("MarketplaceModule");
        const marketplaceResult = await deployWithRetry(
            MarketplaceModule,
            [deployer.address, deploymentResults.platform],
            "MarketplaceModule"
        );
        deploymentResults.marketplaceModule = marketplaceResult.address;
        
        // Step 4: Deploy Governance Token
        console.log("\n🏛️  STEP 4: Deploying GovernanceToken");
        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        const governanceTokenResult = await deployWithRetry(
            GovernanceToken,
            ["Universal Platform Token", "UPT", ethers.parseEther("100000000")],
            "GovernanceToken"
        );
        deploymentResults.governanceToken = governanceTokenResult.address;
        
        // Step 5: Deploy Staking Module
        console.log("\n💰 STEP 5: Deploying StakingModule");
        const StakingModule = await ethers.getContractFactory("StakingModule");
        const stakingResult = await deployWithRetry(
            StakingModule,
            [deploymentResults.platform],
            "StakingModule"
        );
        deploymentResults.stakingModule = stakingResult.address;
        

        // Step 6: Deploy GovernanceModule
        console.log("\n🏛️  STEP 6: Deploying GovernanceModule");
        const GovernanceModule = await ethers.getContractFactory("GovernanceModule");
        const governanceModuleResult = await deployWithRetry(
            GovernanceModule,
            [
                deploymentResults.governanceToken, // governanceToken address
                1, // votingDelay (blocks)
                100, // votingPeriod (blocks)
                ethers.parseEther("1000"), // proposalThreshold
                ethers.parseEther("10000"), // quorumVotes
                60 * 60 * 24 // timelockDelay (seconds)
            ],
            "GovernanceModule"
        );
        deploymentResults.governanceModule = governanceModuleResult.address;

        // Step 7: Deploy DeFiModule
        console.log("\n💹 STEP 7: Deploying DeFiModule");
        const DeFiModule = await ethers.getContractFactory("DeFiModule");
        const defiModuleResult = await deployWithRetry(
            DeFiModule,
            [deployer.address], // feeRecipient
            "DeFiModule"
        );
        deploymentResults.defiModule = defiModuleResult.address;

        // Step 8: Deploy SocialModule
        console.log("\n🌐 STEP 8: Deploying SocialModule");
        const SocialModule = await ethers.getContractFactory("SocialModule");
        let socialModule, socialModuleAddress;
        for (let i = 0; i < 3; i++) {
            try {
                socialModule = await SocialModule.deploy("SocialModule", "1.0", deploymentResults.platform);
                await socialModule.waitForDeployment();
                socialModuleAddress = await socialModule.getAddress();
                console.log(`✅ SocialModule deployed at: ${socialModuleAddress}`);
                break;
            } catch (error) {
                console.log(`❌ Attempt ${i + 1} failed: ${error.message}`);
                if (i === 2) throw error;
                console.log("⏳ Waiting 10 seconds before retry...");
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
        deploymentResults.socialModule = socialModuleAddress;

        // SUCCESS - All modules deployed!
        console.log("\n" + "=".repeat(60));
        console.log("🎉 ALL MODULE CONTRACTS DEPLOYED SUCCESSFULLY!");
        console.log("=".repeat(60));

        console.log("\n📋 DEPLOYED CONTRACTS:");
        console.log("├── UniversalWeb3Platform:", deploymentResults.platform);
        console.log("├── TokenModule:", deploymentResults.tokenModule);
        console.log("├── MarketplaceModule:", deploymentResults.marketplaceModule);
        console.log("├── GovernanceToken:", deploymentResults.governanceToken);
        console.log("├── StakingModule:", deploymentResults.stakingModule);
        console.log("├── GovernanceModule:", deploymentResults.governanceModule);
        console.log("├── DeFiModule:", deploymentResults.defiModule);
        console.log("└── SocialModule:", deploymentResults.socialModule);

        console.log("\n🔗 POLYGONSCAN LINKS:");
        Object.entries(deploymentResults).forEach(([name, address]) => {
            console.log(`• ${name}: https://polygonscan.com/address/${address}`);
        });

        // Save deployment info
        const deploymentInfo = {
            network: "Polygon Mainnet",
            chainId: 137,
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: deploymentResults,
            status: "All module contracts deployed successfully"
        };

        const fs = require("fs");
        const filename = `polygon-deployment-${Date.now()}.json`;
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n💾 Deployment saved to: ${filename}`);

        return deploymentResults;
        
    } catch (error) {
        console.error("\n💥 DEPLOYMENT FAILED:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 You need more MATIC in your wallet");
        } else if (error.message.includes("gas")) {
            console.log("💡 Try increasing gas price or gas limit");
        } else if (error.message.includes("network")) {
            console.log("💡 Check your internet connection");
        }
        
        console.log("\n🔧 TROUBLESHOOTING:");
        console.log("• Your wallet has sufficient MATIC");
        console.log("• Try running the script again");
        console.log("• Consider using a different RPC endpoint");
        
        throw error;
    }
}

main()
    .then((results) => {
        console.log("\n🎊 DEPLOYMENT COMPLETED SUCCESSFULLY!");
        console.log("Your Universal Web3 Platform is now live on Polygon Mainnet! 🚀");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\nDeployment failed:", error.message);
        process.exit(1);
    });