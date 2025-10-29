const { ethers } = require("ethers");
require("dotenv").config();

async function checkTransaction() {
    console.log("🔍 Checking transaction status...");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const txHash = "0xcc7d8b31694ed32895fd7638404226f0b7af42b6b9df2f1b4cf509b56f039528";
    
    try {
        console.log("Transaction Hash:", txHash);
        
        // Get transaction receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        
        if (receipt) {
            console.log("✅ TRANSACTION CONFIRMED!");
            console.log("Block Number:", receipt.blockNumber);
            console.log("Gas Used:", receipt.gasUsed.toString());
            console.log("Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
            
            if (receipt.contractAddress) {
                console.log("\n🎉 CONTRACT DEPLOYED!");
                console.log("📍 Contract Address:", receipt.contractAddress);
                console.log("🔗 PolygonScan:", `https://polygonscan.com/address/${receipt.contractAddress}`);
                console.log("🔗 Transaction:", `https://polygonscan.com/tx/${txHash}`);
                
                // Test the contract
                const contractCode = await provider.getCode(receipt.contractAddress);
                console.log("✅ Contract has code:", contractCode.length > 2);
                
                return receipt.contractAddress;
            } else {
                console.log("❌ No contract address found");
            }
        } else {
            console.log("⏳ Transaction still pending...");
            
            // Check if transaction exists
            const tx = await provider.getTransaction(txHash);
            if (tx) {
                console.log("Transaction found but not mined yet");
                console.log("Gas Price:", ethers.formatUnits(tx.gasPrice, "gwei"), "gwei");
                console.log("Gas Limit:", tx.gasLimit.toString());
            } else {
                console.log("❌ Transaction not found");
            }
        }
    } catch (error) {
        console.error("Error checking transaction:", error.message);
    }
}

checkTransaction();