const { ethers } = require("hardhat");

async function main() {
    try {
        console.log("Testing network connection...");
        
        const [deployer] = await ethers.getSigners();
        console.log("✅ Account:", deployer.address);
        
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("✅ Balance:", ethers.formatEther(balance), "MATIC");
        
        const network = await ethers.provider.getNetwork();
        console.log("✅ Network:", network.name, "Chain ID:", network.chainId.toString());
        
        const gasPrice = await ethers.provider.getFeeData();
        console.log("✅ Gas Price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
        
        console.log("\n🎯 Everything looks good! Network is working fine.");
        
    } catch (error) {
        console.error("❌ Problem found:", error.message);
    }
}

main();