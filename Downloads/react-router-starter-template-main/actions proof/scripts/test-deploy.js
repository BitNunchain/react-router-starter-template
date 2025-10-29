const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Checking network and preparing deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deployer:", deployer.address);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");
    
    // Get current gas price
    const feeData = await ethers.provider.getFeeData();
    console.log("⛽ Current gas price:", ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");
    
    // Test a simple transaction first
    console.log("\n🧪 Testing network connection...");
    
    try {
        // Deploy a simple test contract first
        console.log("📝 Deploying test contract to verify network...");
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        
        const testToken = await MockERC20.deploy(
            "Test Token",
            "TEST", 
            ethers.parseEther("1000"), 
            {
                gasLimit: 2000000,
                gasPrice: feeData.gasPrice
            }
        );
        
        console.log("⏳ Waiting for deployment...");
        await testToken.waitForDeployment();
        const testAddress = await testToken.getAddress();
        console.log("✅ Test contract deployed at:", testAddress);
        
        // Now try the main deployment
        console.log("\n🚀 Network is working! Starting main deployment...");
        
        // Deploy UniversalWeb3Platform with conservative gas settings
        console.log("🏗️  Deploying UniversalWeb3Platform...");
        const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
        
        const platform = await UniversalWeb3Platform.deploy(
            deployer.address, // admin
            250, // 2.5% platform fee
            deployer.address, // fee recipient
            {
                gasLimit: 3000000, // Conservative gas limit
                gasPrice: feeData.gasPrice
            }
        );
        
        console.log("⏳ Waiting for UniversalWeb3Platform deployment...");
        await platform.waitForDeployment();
        const platformAddress = await platform.getAddress();
        console.log("✅ UniversalWeb3Platform deployed:", platformAddress);
        
        console.log("\n🎉 SUCCESS! Main platform deployed successfully!");
        console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${platformAddress}`);
        
        return {
            platform: platformAddress,
            testToken: testAddress,
            deployer: deployer.address,
            network: "Polygon Mainnet"
        };
        
    } catch (error) {
        console.error("\n❌ Deployment Error:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Solution: Add more MATIC to your wallet");
        } else if (error.message.includes("gas")) {
            console.log("💡 Solution: Try increasing gas limit or gas price");
        } else if (error.message.includes("network")) {
            console.log("💡 Solution: Check your internet connection or try a different RPC");
        }
        
        throw error;
    }
}

main()
    .then((result) => {
        console.log("\n🎊 Test deployment successful!");
        console.log("📋 Results:", result);
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Deployment failed:", error.message);
        process.exit(1);
    });