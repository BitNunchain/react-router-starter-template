const { ethers } = require("ethers");

async function quickCheck() {
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const txHash = "0xcc7d8b31694ed32895fd7638404226f0b7af42b6b9df2f1b4cf509b56f039528";
    
    try {
        const receipt = await provider.getTransactionReceipt(txHash);
        
        if (receipt) {
            console.log("🎉 SUCCESS! Contract deployed!");
            console.log("Contract Address:", receipt.contractAddress);
            console.log("Gas Used:", receipt.gasUsed.toString());
            console.log("Block:", receipt.blockNumber);
            console.log("Status:", receipt.status === 1 ? "✅ SUCCESS" : "❌ FAILED");
            
            if (receipt.contractAddress) {
                console.log("\n🔗 Links:");
                console.log("Contract:", `https://polygonscan.com/address/${receipt.contractAddress}`);
                console.log("Transaction:", `https://polygonscan.com/tx/${txHash}`);
            }
        } else {
            console.log("⏳ Still pending... Let's wait a bit more");
        }
    } catch (error) {
        console.log("Error:", error.message);
    }
}

quickCheck();