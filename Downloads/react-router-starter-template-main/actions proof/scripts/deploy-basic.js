const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying SimpleStorage...");
    
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const contract = await SimpleStorage.deploy();
    
    await contract.waitForDeployment();
    console.log("Contract deployed to:", await contract.getAddress());
}

main().catch(console.error);