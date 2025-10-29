const { ethers } = require('ethers');

async function deployDirect() {
    console.log("🚀 Direct deployment without Hardhat...");
    
    // Your private key and RPC
    const privateKey = "e4649fad4207d1a8a8200b24f02524220ec9bf4666d737ed24ed529cc57583e3";
    const rpcUrl = "https://polygon-rpc.com";
    
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log("Address:", wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Balance:", ethers.formatEther(balance), "MATIC");
    
    // Simple contract bytecode (Hello World)
    const contractBytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060405180606001604052806040518060400160405280600d81526020017f48656c6c6f20506f6c79676f6e210000000000000000000000000000000000008152508152602001336001600a0100000000000000000000000000000000000000000000000000000000000000";
    
    console.log("Deploying contract...");
    
    // Deploy transaction
    const deployTx = {
        data: contractBytecode,
        gasLimit: 500000,
        gasPrice: ethers.parseUnits("80", "gwei"),
    };
    
    try {
        const tx = await wallet.sendTransaction(deployTx);
        console.log("Transaction sent:", tx.hash);
        
        const receipt = await tx.wait();
        console.log("✅ SUCCESS! Contract deployed!");
        console.log("Contract Address:", receipt.contractAddress);
        console.log("Gas Used:", receipt.gasUsed.toString());
        console.log("Block:", receipt.blockNumber);
        console.log("PolygonScan:", `https://polygonscan.com/address/${receipt.contractAddress}`);
        
    } catch (error) {
        console.error("❌ Deployment failed:", error.message);
    }
}

deployDirect();