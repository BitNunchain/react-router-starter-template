# Universal Web3 Platform 🚀

A comprehensive, modular Web3 platform that combines ALL major DeFi, NFT, and social features in one unified ecosystem. This platform provides everything you need to create a complete Web3 application with advanced functionality.

## 🌟 Features Overview

### 🎨 **Token Module** - Complete Token Ecosystem
- **Multi-Standard Support**: ERC20, ERC721, ERC1155
- **Advanced Minting**: Regular, batch, and signature-based minting
- **Royalty System**: Built-in royalty management with EIP-2981 compliance
- **Flexible Pricing**: Configurable mint prices and payment tokens
- **Supply Management**: Maximum supply limits and minting controls

### 🛒 **Marketplace Module** - Full-Featured Trading
- **Multiple Listing Types**: Fixed price, auctions, and offers
- **Payment Flexibility**: ETH and ERC20 token payments
- **Automated Royalties**: Automatic royalty distribution on sales
- **Platform Fees**: Configurable platform fee structure
- **Advanced Auctions**: Reserve prices, bid increments, and automatic settlements

### 💰 **Staking Module** - Advanced Yield Generation
- **Multi-Token Staking**: Support for ERC20, ERC1155, and LP tokens
- **Flexible Rewards**: Fixed, percentage, and dynamic reward systems
- **Staking Multipliers**: Time-based reward bonuses
- **Lock Periods**: Optional minimum staking durations
- **Emergency Withdrawals**: Admin-controlled emergency exits

### 🏛️ **Governance Module** - Decentralized Decision Making
- **Proposal System**: Create and vote on governance proposals
- **Timelock Security**: Built-in execution delays for security
- **Vote Delegation**: Delegate voting power to other addresses
- **Quorum Requirements**: Minimum participation thresholds
- **Treasury Management**: Community-controlled treasury system

### 🔄 **DeFi Module** - Complete DeFi Suite
- **Liquidity Pools**: Create and manage AMM-style pools
- **Token Swapping**: Automated market maker functionality
- **Yield Farming**: LP token staking with reward distribution
- **Lending Pools**: Deposit and earn interest on assets
- **Price Oracles**: Integrated price feed system

### 🌐 **Social Module** - Community & Social Features
- **Airdrops**: Create and manage token airdrops with various criteria
- **Social Verification**: Farcaster, Lens, and Twitter integrations
- **Community System**: Create token-gated communities
- **Social Quests**: Reward users for social engagement
- **Content System**: Post, like, and interact within communities

## 🏗️ Architecture

The platform uses a **modular architecture** to avoid inheritance conflicts and gas limits:

```
UniversalWeb3Platform (Main Contract)
├── TokenModule          (Token creation & management)
├── MarketplaceModule    (Trading & auctions)
├── StakingModule        (Staking & rewards)
├── GovernanceModule     (DAO & voting)
├── DeFiModule          (Pools & swaps)
└── SocialModule        (Community & airdrops)
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd universal-web3-platform

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

### Configuration

Edit `.env` file with your settings:

```env
# Network RPCs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Private key for deployment
PRIVATE_KEY=your_private_key_here

# API Keys for verification
ETHERSCAN_API_KEY=your_etherscan_key
```

### Deployment

```bash
# Compile contracts
npm run compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy
```

### Testing

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test
```

## 📋 Usage Examples

### Creating and Minting NFTs

```javascript
// Create a new token
const tokenId = await tokenModule.createToken(
    "My Collection",      // name
    "MYC",               // symbol
    "ipfs://metadata/",  // base URI
    0,                   // TokenType.ERC1155
    10000,               // max supply
    ethers.utils.parseEther("0.1"), // mint price
    royaltyRecipient,    // royalty recipient
    500                  // 5% royalty
);

// Mint tokens
await tokenModule.mint(
    recipient,
    tokenId,
    amount,
    "0x",
    { value: totalPrice }
);
```

### Creating Marketplace Listings

```javascript
// Fixed price listing
await marketplaceModule.createListing(
    nftContract,
    tokenId,
    amount,
    ethers.utils.parseEther("1"), // price
    ethers.constants.AddressZero, // ETH payment
    1,              // TokenStandard.ERC1155
    86400           // 24 hours duration
);

// Auction listing
await marketplaceModule.createAuction(
    nftContract,
    tokenId,
    amount,
    ethers.utils.parseEther("0.5"), // reserve price
    ethers.utils.parseEther("0.1"), // bid increment
    ethers.constants.AddressZero,   // ETH payment
    1,              // TokenStandard.ERC1155
    86400           // 24 hours duration
);
```

### Setting Up Staking

```javascript
// Create staking pool
await stakingModule.createPool(
    "My Staking Pool",
    stakingToken,
    0,                   // token ID (for ERC1155)
    rewardToken,
    0,                   // PoolType.ERC20
    0,                   // RewardType.FIXED
    ethers.utils.parseEther("1"), // 1 token per second
    0,                   // no lock period
    0,                   // no max stake
    ethers.utils.parseEther("1"), // min 1 token
    86400 * 30          // 30 days duration
);

// Stake tokens
await stakingModule.stake(poolId, amount);
```

### Creating Liquidity Pools

```javascript
// Create pool
await defiModule.createPool(
    tokenA,
    tokenB,
    30  // 0.3% fee
);

// Add liquidity
await defiModule.addLiquidity(
    poolId,
    amountA,
    amountB,
    minAmountA,
    minAmountB
);

// Swap tokens
await defiModule.swapTokens(
    poolId,
    tokenIn,
    amountIn,
    minAmountOut,
    recipient
);
```

### Social Features

```javascript
// Create airdrop
await socialModule.createAirdrop(
    "Welcome Airdrop",
    0,              // AirdropType.ERC20
    token,
    0,              // tokenId
    ethers.utils.parseEther("10000"), // total amount
    ethers.utils.parseEther("100"),   // amount per claim
    86400 * 7,      // 7 days duration
    false           // no social verification
);

// Create community
await socialModule.createCommunity(
    "My Community",
    "Community description",
    membershipToken,
    minTokenBalance,
    true            // public
);
```

## 🔧 Advanced Configuration

### Platform Fees
- Configurable platform fees (default: 2.5%)
- Separate fee recipients for different modules
- Emergency fee updates through governance

### Access Control
- Role-based access control system
- Multi-signature admin functions
- Upgradeable module architecture

### Security Features
- Reentrancy protection
- Pausable contracts
- Emergency withdrawal mechanisms
- Timelock for sensitive operations

## 🧪 Testing

The platform includes comprehensive tests covering:

- ✅ Individual module functionality
- ✅ Cross-module interactions  
- ✅ Edge cases and error conditions
- ✅ Gas optimization scenarios
- ✅ Security vulnerabilities

Run tests with detailed logging:

```bash
npx hardhat test --verbose
```

## 📊 Gas Optimization

The modular architecture provides several gas benefits:

- **Reduced Contract Size**: Each module stays under size limits
- **Selective Deployment**: Deploy only needed modules
- **Upgrade Flexibility**: Update individual modules without redeploying everything
- **Gas Efficient**: Optimized for common operations

## 🛠️ Development

### Adding New Modules

1. Create module contract in `contracts/modules/`
2. Implement required interfaces
3. Add to deployment script
4. Update platform initialization
5. Add comprehensive tests

### Module Interface

```solidity
interface IModule {
    function initialize(address platform) external;
    function pause() external;
    function unpause() external;
}
```

## 📈 Roadmap

### Phase 1 (Current)
- [x] Core module development
- [x] Comprehensive testing
- [x] Documentation
- [x] Deployment scripts

### Phase 2 (Next)
- [ ] Layer 2 deployment
- [ ] Advanced governance features
- [ ] Cross-chain bridges
- [ ] Enhanced social integrations

### Phase 3 (Future)
- [ ] AI-powered features
- [ ] Advanced DeFi protocols
- [ ] Enterprise integrations
- [ ] Mobile SDK

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Check code style
npm run lint

# Format code
npm run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full docs](./docs/)
- **Discord**: [Join our community](https://discord.gg/yourserver)
- **Issues**: [GitHub Issues](https://github.com/yourusername/universal-web3-platform/issues)
- **Email**: support@yourplatform.com

## ⚠️ Security

This platform handles financial assets. Please:

- **Audit before mainnet deployment**
- **Test thoroughly on testnets**
- **Use multisig for admin functions**
- **Monitor contract interactions**
- **Report security issues privately**

## 🎯 Use Cases

This platform is perfect for:

- **NFT Marketplaces**: Complete trading infrastructure
- **DeFi Protocols**: Comprehensive DeFi suite
- **DAO Platforms**: Full governance system
- **Social Tokens**: Community and social features
- **Gaming Platforms**: In-game economies
- **Creator Platforms**: Creator monetization tools

---

**Built with ❤️ for the Web3 community**

*This platform provides everything you need to create the next generation of Web3 applications. From simple NFT collections to complex DeFi protocols, the Universal Web3 Platform has you covered.*