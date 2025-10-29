const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deployModuleWithParams(moduleName, constructorArgs) {
    console.log(`🚀 Deploying ${moduleName}...`);
    
    try {
        const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        const artifactPath = `./artifacts/contracts/modules/${moduleName}.sol/${moduleName}.json`;
        
        if (!fs.existsSync(artifactPath)) {
            console.log(`❌ Contract artifact not found: ${artifactPath}`);
            return null;
        }
        
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
        
        console.log(`📝 Constructor args:`, constructorArgs);
        
        const contract = await factory.deploy(...constructorArgs, {
            gasLimit: 3000000,
            gasPrice: ethers.parseUnits("50", "gwei")
        });
        
        console.log(`📤 Transaction: ${contract.deploymentTransaction().hash}`);
        console.log("⏳ Waiting for confirmation...");
        
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        
        console.log(`✅ ${moduleName} deployed!`);
        console.log(`📍 Address: ${address}`);
        
        return address;
        
    } catch (error) {
        console.error(`❌ Failed to deploy ${moduleName}:`, error.message);
        return null;
    }
}

async function deployAllModulesWithParams() {
    console.log("🌟 DEPLOYING MODULES WITH CORRECT PARAMETERS");
    console.log("===========================================");
    
    const platformAddress = "0x42c1AFffF7DB89b78e8D117Ae2C4941F20fa7909";
    const deployerAddress = "0x87C89A004dFBA96612e8Ef017ddB32f4A01Ab79c";
    
    const modulesToDeploy = [
        {
            name: "TokenModule",
            args: ["Universal Token Module", "1.0", platformAddress]
        },
        {
            name: "MarketplaceModule", 
            args: [platformAddress]
        },
        {
            name: "StakingModule",
            args: [platformAddress]
        },
        {
            name: "GovernanceModule",
            args: ["Universal DAO", "UDAO", platformAddress]
        },
        {
            name: "DeFiModule",
            args: [platformAddress]
        },
        {
            name: "SocialModule",
            args: [platformAddress]
        }
    ];
    
    const results = {
        UniversalWeb3Platform: platformAddress
    };
    
    for (const module of modulesToDeploy) {
        console.log(`\n${modulesToDeploy.indexOf(module) + 1}/${modulesToDeploy.length} - Deploying ${module.name}...`);
        
        const address = await deployModuleWithParams(module.name, module.args);
        if (address) {
            results[module.name] = address;
        }
        
        // Delay between deployments
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log("\n🎉 FINAL DEPLOYMENT SUMMARY:");
    console.log("============================");
    
    for (const [contract, address] of Object.entries(results)) {
        console.log(`✅ ${contract}: ${address}`);
    }
    
    fs.writeFileSync("all-deployed-contracts.json", JSON.stringify(results, null, 2));
    console.log("\n📄 All results saved to all-deployed-contracts.json");
    
    return results;
}

deployAllModulesWithParams()
    .then((results) => {
        console.log("\n🚀 Complete Web3 Platform deployed!");
        console.log("🎯 Ready for initialization and testing!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });