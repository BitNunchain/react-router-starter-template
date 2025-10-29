const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deployContract(contractName, constructorArgs = []) {
    console.log(`🚀 Deploying ${contractName}...`);
    
    // Setup provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Load compiled contract
    const artifactPath = `./artifacts/contracts/${contractName}.sol/${contractName}.json`;
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    // Create contract factory
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    
    // Deploy with conservative settings
    const contract = await factory.deploy(...constructorArgs, {
        gasLimit: 2500000,
        gasPrice: ethers.parseUnits("45", "gwei")
    });
    
    console.log("Transaction:", contract.deploymentTransaction().hash);
    console.log("Waiting for confirmation...");
    
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    
    console.log(`✅ ${contractName} deployed!`);
    console.log("Address:", address);
    console.log("PolygonScan:", `https://polygonscan.com/address/${address}`);
    
    return { address, contract };
}

async function deployAllContracts() {
    console.log("🌟 DEPLOYING ALL CONTRACTS TO POLYGON MAINNET");
    console.log("=" .repeat(50));
    
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("Deployer:", signer.address);
    
    const balance = await provider.getBalance(signer.address);
    console.log("Balance:", ethers.formatEther(balance), "MATIC");
    
    const results = {};
    
    try {
        // 1. Deploy UniversalNFT
        console.log("\n1️⃣ Deploying UniversalNFT...");
        const nft = await deployContract("UniversalNFT", [signer.address]);
        results.UniversalNFT = nft.address;
        
        console.log("\n🎉 CONTRACT 1 DEPLOYED SUCCESSFULLY!");
        console.log("UniversalNFT:", nft.address);
        
        // Save progress
        fs.writeFileSync("deployment-progress.json", JSON.stringify(results, null, 2));
        
        console.log("\n✅ FIRST CONTRACT COMPLETE!");
        console.log("Ready to deploy more contracts...");
        
        return results;
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
        throw error;
    }
}

deployAllContracts()
    .then((results) => {
        console.log("\n🎊 DEPLOYMENT RESULTS:");
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });