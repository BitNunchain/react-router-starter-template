const { ethers } = require("hardhat");

async function main() {
    const walletAddress = "0x87C89A004dFBA96612e8Ef017ddB32f4A01Ab79c";
    
    console.log("🔍 Checking Polygon Mainnet balance...");
    console.log("📍 Wallet:", walletAddress);
    
    try {
        const balance = await ethers.provider.getBalance(walletAddress);
        const balanceInMatic = ethers.formatEther(balance);
        
        console.log("💰 Balance:", balanceInMatic, "MATIC");
        
        if (parseFloat(balanceInMatic) < 3) {
            console.log("⚠️  WARNING: Low balance! Need at least 3-5 MATIC for deployment");
            console.log("🔗 Get MATIC from: https://wallet.polygon.technology/polygon/bridge");
        } else {
            console.log("✅ Sufficient balance for deployment!");
        }
        
        // Get network info
        const network = await ethers.provider.getNetwork();
        console.log("🌐 Network:", network.name, "| Chain ID:", network.chainId.toString());
        
    } catch (error) {
        console.error("❌ Error checking balance:", error.message);
        console.log("💡 Make sure your RPC URL is working");
    }
}

main().catch(console.error);