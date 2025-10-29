const { ethers } = require("ethers");

async function waitForTransaction() {
    console.log("⏳ Waiting for transaction to be mined...");
    
    const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
    const txHash = "0xcc7d8b31694ed32895fd7638404226f0b7af42b6b9df2f1b4cf509b56f039528";
    
    try {
        console.log("Waiting for confirmation...");
        
        // Wait for the transaction to be mined
        const receipt = await provider.waitForTransaction(txHash, 1, 60000); // 60 second timeout
        
        if (receipt) {
            console.log("✅ TRANSACTION CONFIRMED!");
            console.log("Block:", receipt.blockNumber);
            console.log("Gas Used:", receipt.gasUsed.toString());
            
            if (receipt.contractAddress) {
                console.log("\n🎉 CONTRACT SUCCESSFULLY DEPLOYED!");
                console.log("📍 Address:", receipt.contractAddress);
                console.log("🔗 View on PolygonScan:");
                console.log(`   https://polygonscan.com/address/${receipt.contractAddress}`);
                console.log(`   https://polygonscan.com/tx/${txHash}`);
                
                // Save the contract address
                const fs = require("fs");
                const deploymentInfo = {
                    contractAddress: receipt.contractAddress,
                    transactionHash: txHash,
                    blockNumber: receipt.blockNumber.toString(),
                    gasUsed: receipt.gasUsed.toString(),
                    deployedAt: new Date().toISOString(),
                    network: "Polygon Mainnet"
                };
                
                fs.writeFileSync("deployment-success.json", JSON.stringify(deploymentInfo, null, 2));
                console.log("📄 Deployment info saved to deployment-success.json");
                
                return receipt.contractAddress;
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        if (error.message.includes("timeout")) {
            console.log("⏰ Transaction is taking longer than expected. Check PolygonScan:");
            console.log(`https://polygonscan.com/tx/${txHash}`);
        }
    }
}

waitForTransaction();