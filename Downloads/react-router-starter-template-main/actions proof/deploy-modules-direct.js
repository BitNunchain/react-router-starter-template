const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deployModule(moduleName) {
    console.log(`🚀 Deploying ${moduleName}...`);
    
    try {
        // Setup provider and signer  
        const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        // Load compiled contract
        const artifactPath = `./artifacts/contracts/modules/${moduleName}.sol/${moduleName}.json`;
        
        if (!fs.existsSync(artifactPath)) {
            console.log(`❌ Contract artifact not found: ${artifactPath}`);
            return null;
        }
        
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        
        // Create contract factory
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
        
        // Deploy with conservative settings
        const contract = await factory.deploy({
            gasLimit: 3000000,
            gasPrice: ethers.parseUnits("50", "gwei")
        });
        
        console.log(`📤 Transaction: ${contract.deploymentTransaction().hash}`);
        console.log("⏳ Waiting for confirmation...");
        
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        
        console.log(`✅ ${moduleName} deployed!`);
        console.log(`📍 Address: ${address}`);
        console.log(`🔗 PolygonScan: https://polygonscan.com/address/${address}`);
        
        return address;
        
    } catch (error) {
        console.error(`❌ Failed to deploy ${moduleName}:`, error.message);
        return null;
    }
}

async function deployAllModules() {
    console.log("🌟 DEPLOYING REMAINING MODULES");
    console.log("===============================");
    
    const modules = [
        "TokenModule",
        "MarketplaceModule", 
        "StakingModule",
        "GovernanceModule",
        "DeFiModule",
        "SocialModule"
    ];
    
    const results = {
        UniversalWeb3Platform: "0x42c1AFffF7DB89b78e8D117Ae2C4941F20fa7909" // Already deployed
    };
    
    for (const module of modules) {
        console.log(`\n${modules.indexOf(module) + 1}/${modules.length} - Deploying ${module}...`);
        
        const address = await deployModule(module);
        if (address) {
            results[module] = address;
            console.log(`✅ ${module}: ${address}`);
        } else {
            console.log(`❌ ${module}: Failed`);
        }
        
        // Small delay between deployments
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log("\n🎉 DEPLOYMENT SUMMARY:");
    console.log("======================");
    
    for (const [contract, address] of Object.entries(results)) {
        if (address) {
            console.log(`✅ ${contract}: ${address}`);
        }
    }
    
    // Save results
    fs.writeFileSync("deployed-contracts.json", JSON.stringify(results, null, 2));
    console.log("\n📄 Results saved to deployed-contracts.json");
    
    return results;
}

deployAllModules()
    .then((results) => {
        console.log("\n🚀 All contracts deployed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });