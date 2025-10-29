const { ethers } = require("hardhat");

async function main() {
    console.log("⚡ DEPLOYING ONE CONTRACT ONLY");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    console.log("Deploying FastNFT...");
    
    const FastNFT = await ethers.getContractFactory("FastNFT");
    const nft = await FastNFT.deploy({
        gasLimit: 800000, // Very small gas limit
        gasPrice: ethers.parseUnits("25", "gwei"), // Low gas price
    });
    
    await nft.waitForDeployment();
    const address = await nft.getAddress();
    
    console.log("✅ DEPLOYED!");
    console.log("Address:", address);
    console.log("PolygonScan:", `https://polygonscan.com/address/${address}`);
    
    return address;
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});