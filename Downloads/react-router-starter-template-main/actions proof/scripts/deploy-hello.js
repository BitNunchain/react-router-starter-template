const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying HelloWorld contract...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    
    console.log("Deploying...");
    const contract = await HelloWorld.deploy({
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("70", "gwei"),
    });
    
    console.log("Waiting for deployment...");
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    
    console.log("✅ SUCCESS!");
    console.log("Contract Address:", address);
    console.log("View on PolygonScan:", `https://polygonscan.com/address/${address}`);
    
    // Test it works
    const message = await contract.getMessage();
    console.log("Contract says:", message);
}

main().catch(console.error);