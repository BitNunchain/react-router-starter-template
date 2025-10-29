const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 DEPLOYING SINGLE CONTRACT TO POLYGON MAINNET");
    console.log("=" .repeat(50));
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deployer:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");
    
    try {
        // Deploy ONLY the main platform contract
        console.log("\n🏗️  Deploying UniversalWeb3Platform (Main Contract)...");
        
        const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
        
        const platform = await UniversalWeb3Platform.deploy(
            deployer.address, // admin
            250, // 2.5% fee
            deployer.address, // fee recipient
            {
                gasLimit: 3000000,
                gasPrice: ethers.parseUnits("60", "gwei"), // 60 gwei
            }
        );
        
        console.log("⏳ Waiting for deployment confirmation...");
        await platform.waitForDeployment();
        
        const platformAddress = await platform.getAddress();
        
        console.log("\n✅ SUCCESS!");
        console.log("🏗️  UniversalWeb3Platform deployed at:", platformAddress);
        console.log("🔗 PolygonScan:", `https://polygonscan.com/address/${platformAddress}`);
        
        // Save the address for next deployments
        const fs = require("fs");
        const deploymentData = {
            network: "Polygon Mainnet",
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            contracts: {
                UniversalWeb3Platform: platformAddress
            }
        };
        
        fs.writeFileSync("deployment-step1.json", JSON.stringify(deploymentData, null, 2));
        console.log("\n💾 Address saved to deployment-step1.json");
        
        console.log("\n🎯 NEXT STEP: Run deploy-step2.js to deploy TokenModule");
        
        return platformAddress;
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Add more MATIC to your wallet");
        } else if (error.message.includes("gas")) {
            console.log("💡 Try increasing gas price");
        }
        
        throw error;
    }
}

main()
    .then((address) => {
        console.log(`\n🎉 Step 1 Complete! Platform deployed at: ${address}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error("Deployment failed:", error.message);
        process.exit(1);
    });