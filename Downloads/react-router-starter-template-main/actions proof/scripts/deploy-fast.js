const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Fast Deploy - Simple Web3 Platform");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "MATIC");
    
    console.log("Deploying contract...");
    
    const SimpleWeb3Platform = await ethers.getContractFactory("SimpleWeb3Platform");
    
    const platform = await SimpleWeb3Platform.deploy(
        "https://ipfs.io/ipfs/", 
        deployer.address,
        {
            gasLimit: 1200000,
            gasPrice: ethers.parseUnits("30", "gwei"),
        }
    );
    
    await platform.waitForDeployment();
    const address = await platform.getAddress();
    
    console.log("✅ SUCCESS!");
    console.log("Contract:", address);
    console.log("Explorer:", `https://polygonscan.com/address/${address}`);
    
    // Save deployment info
    const fs = require("fs");
    const deploymentInfo = {
        network: "Polygon",
        address: address,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync("deployment-result.json", JSON.stringify(deploymentInfo, null, 2));
    
    return address;
}

main()
    .then((address) => {
        console.log("Deployed at:", address);
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });