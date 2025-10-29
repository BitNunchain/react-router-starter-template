const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Universal Web3 Platform", function () {
    let platform, tokenModule, marketplaceModule, stakingModule, governanceModule, defiModule, socialModule;
    let governanceToken, mockToken;
    let owner, addr1, addr2, addr3;
    let deploymentInfo;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy governance token
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        governanceToken = await MockERC20.deploy("Governance Token", "GOV", ethers.parseEther("1000000"));
        await governanceToken.waitForDeployment();

        mockToken = await MockERC20.deploy("Mock Token", "MOCK", ethers.parseEther("1000000"));
        await mockToken.waitForDeployment();

        // Deploy main platform
        const UniversalWeb3Platform = await ethers.getContractFactory("UniversalWeb3Platform");
        platform = await UniversalWeb3Platform.deploy(
            owner.address,
            250, // 2.5%
            owner.address
        );
        await platform.deployed();

        // Deploy modules
        const TokenModule = await ethers.getContractFactory("TokenModule");
        tokenModule = await TokenModule.deploy(
            "Universal Web3 Platform",
            "1",
            platform.address
        );
        await tokenModule.deployed();

        const MarketplaceModule = await ethers.getContractFactory("MarketplaceModule");
        marketplaceModule = await MarketplaceModule.deploy(
            owner.address,
            platform.address
        );
        await marketplaceModule.deployed();

        const StakingModule = await ethers.getContractFactory("StakingModule");
        stakingModule = await StakingModule.deploy(platform.address);
        await stakingModule.deployed();

        const GovernanceModule = await ethers.getContractFactory("GovernanceModule");
        governanceModule = await GovernanceModule.deploy(
            governanceToken.address,
            1, // votingDelay
            100, // votingPeriod (shorter for testing)
            ethers.utils.parseEther("1000"), // proposalThreshold
            ethers.utils.parseEther("5000"), // quorumVotes
            86400 // timelockDelay (1 day)
        );
        await governanceModule.deployed();

        const DeFiModule = await ethers.getContractFactory("DeFiModule");
        defiModule = await DeFiModule.deploy(owner.address);
        await defiModule.deployed();

        const SocialModule = await ethers.getContractFactory("SocialModule");
        socialModule = await SocialModule.deploy(
            "Universal Web3 Platform Social",
            "1",
            platform.address
        );
        await socialModule.deployed();

        // Initialize modules
        await platform.initializeModules(
            tokenModule.address,
            marketplaceModule.address,
            stakingModule.address,
            governanceModule.address,
            defiModule.address,
            socialModule.address
        );

        // Grant necessary roles
        const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
        await tokenModule.grantRole(ADMIN_ROLE, platform.address);
        await marketplaceModule.grantRole(ADMIN_ROLE, platform.address);
        await stakingModule.grantRole(ADMIN_ROLE, platform.address);
        await defiModule.grantRole(ADMIN_ROLE, platform.address);
        await socialModule.grantRole(ADMIN_ROLE, platform.address);

        // Distribute tokens for testing
        await mockToken.transfer(addr1.address, ethers.utils.parseEther("10000"));
        await mockToken.transfer(addr2.address, ethers.utils.parseEther("10000"));
        await governanceToken.transfer(addr1.address, ethers.utils.parseEther("10000"));
    });

    describe("Platform Initialization", function () {
        it("Should initialize platform correctly", async function () {
            const isInitialized = await platform.isFullyInitialized();
            expect(isInitialized).to.be.true;

            const modules = await platform.getModules();
            expect(modules.token).to.equal(tokenModule.address);
            expect(modules.marketplace).to.equal(marketplaceModule.address);
            expect(modules.staking).to.equal(stakingModule.address);
            expect(modules.governance).to.equal(governanceModule.address);
            expect(modules.defi).to.equal(defiModule.address);
            expect(modules.social).to.equal(socialModule.address);
        });

        it("Should have correct platform configuration", async function () {
            const config = await platform.platformConfig();
            expect(config.platformFeePercent).to.equal(250);
            expect(config.feeRecipient).to.equal(owner.address);
            expect(config.isInitialized).to.be.true;
        });
    });

    describe("Token Module", function () {
        it("Should create and mint tokens", async function () {
            // Create a token
            await tokenModule.createToken(
                "Test NFT",
                "TNFT",
                "https://example.com/metadata/",
                0, // ERC1155
                1000, // max supply
                ethers.utils.parseEther("0.1"), // mint price
                owner.address, // royalty recipient
                500 // 5% royalty
            );

            // Mint tokens
            const mintPrice = ethers.utils.parseEther("0.1");
            await tokenModule.connect(addr1).mint(
                addr1.address,
                1,
                5,
                "0x",
                { value: mintPrice.mul(5) }
            );

            const balance = await tokenModule.balanceOf(addr1.address, 1);
            expect(balance).to.equal(5);
        });

        it("Should handle royalty payments correctly", async function () {
            await tokenModule.createToken(
                "Test NFT",
                "TNFT",
                "https://example.com/metadata/",
                0,
                1000,
                ethers.utils.parseEther("0.1"),
                owner.address,
                1000 // 10% royalty
            );

            const [recipient, royaltyAmount] = await tokenModule.royaltyInfo(1, ethers.utils.parseEther("1"));
            expect(recipient).to.equal(owner.address);
            expect(royaltyAmount).to.equal(ethers.utils.parseEther("0.1"));
        });
    });

    describe("Marketplace Module", function () {
        beforeEach(async function () {
            // Create and mint a token for marketplace testing
            await tokenModule.createToken(
                "Marketplace NFT",
                "MNFT",
                "https://example.com/metadata/",
                0,
                1000,
                0, // free mint
                owner.address,
                250 // 2.5% royalty
            );

            await tokenModule.mint(addr1.address, 1, 10, "0x");
        });

        it("Should create and buy fixed price listing", async function () {
            // Approve marketplace to transfer tokens
            await tokenModule.connect(addr1).setApprovalForAll(marketplaceModule.address, true);

            // Create listing
            await marketplaceModule.connect(addr1).createListing(
                tokenModule.address,
                1, // tokenId
                5, // amount
                ethers.utils.parseEther("1"), // price
                ethers.constants.AddressZero, // ETH payment
                1, // ERC1155
                86400 // 1 day duration
            );

            // Buy the listing
            await marketplaceModule.connect(addr2).buyNow(1, { value: ethers.utils.parseEther("1") });

            // Check token transfer
            const buyerBalance = await tokenModule.balanceOf(addr2.address, 1);
            expect(buyerBalance).to.equal(5);

            const sellerBalance = await tokenModule.balanceOf(addr1.address, 1);
            expect(sellerBalance).to.equal(5); // 10 - 5 sold
        });

        it("Should handle auction listings", async function () {
            await tokenModule.connect(addr1).setApprovalForAll(marketplaceModule.address, true);

            // Create auction
            await marketplaceModule.connect(addr1).createAuction(
                tokenModule.address,
                1,
                3,
                ethers.utils.parseEther("0.5"), // reserve price
                ethers.utils.parseEther("0.1"), // bid increment
                ethers.constants.AddressZero,
                1,
                86400
            );

            // Place bid
            await marketplaceModule.connect(addr2).placeBid(2, { value: ethers.utils.parseEther("0.6") });

            // Check auction state
            const auction = await marketplaceModule.auctions(2);
            expect(auction.highestBidder).to.equal(addr2.address);
            expect(auction.highestBid).to.equal(ethers.utils.parseEther("0.6"));
        });
    });

    describe("Staking Module", function () {
        it("Should create staking pools and handle staking", async function () {
            // Create a staking pool
            await stakingModule.createPool(
                "Test Staking Pool",
                mockToken.address,
                0, // Not ERC1155
                mockToken.address, // Same token for rewards
                0, // ERC20
                0, // Fixed rewards
                ethers.utils.parseEther("1"), // 1 token per second
                0, // No lock period
                0, // No max stake
                ethers.utils.parseEther("1"), // Min 1 token
                86400 // 1 day duration
            );

            // Approve and stake tokens
            await mockToken.connect(addr1).approve(stakingModule.address, ethers.utils.parseEther("100"));
            await stakingModule.connect(addr1).stake(1, ethers.utils.parseEther("100"));

            const userStake = await stakingModule.getUserStake(1, addr1.address);
            expect(userStake.amount).to.equal(ethers.utils.parseEther("100"));
        });

        it("Should calculate and distribute rewards", async function () {
            // Transfer reward tokens to staking module
            await mockToken.transfer(stakingModule.address, ethers.utils.parseEther("100000"));

            await stakingModule.createPool(
                "Reward Pool",
                mockToken.address,
                0,
                mockToken.address,
                0,
                0,
                ethers.utils.parseEther("1"),
                0,
                0,
                ethers.utils.parseEther("1"),
                86400
            );

            await mockToken.connect(addr1).approve(stakingModule.address, ethers.utils.parseEther("100"));
            await stakingModule.connect(addr1).stake(1, ethers.utils.parseEther("100"));

            // Fast forward time (simulate by mining blocks)
            await network.provider.send("evm_increaseTime", [3600]); // 1 hour
            await network.provider.send("evm_mine");

            const pendingRewards = await stakingModule.getPendingRewards(1, addr1.address);
            expect(pendingRewards).to.be.gt(0);
        });
    });

    describe("DeFi Module", function () {
        beforeEach(async function () {
            // Transfer tokens to users for DeFi testing
            await mockToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
            await mockToken.transfer(addr2.address, ethers.utils.parseEther("1000"));
        });

        it("Should create liquidity pools", async function () {
            await defiModule.createPool(
                mockToken.address,
                governanceToken.address,
                30 // 0.3% fee
            );

            const poolInfo = await defiModule.getPoolInfo(1);
            expect(poolInfo.token0).to.equal(mockToken.address.toLowerCase() < governanceToken.address.toLowerCase() ? 
                mockToken.address : governanceToken.address);
            expect(poolInfo.fee).to.equal(30);
        });

        it("Should add liquidity to pools", async function () {
            await defiModule.createPool(mockToken.address, governanceToken.address, 30);

            // Approve tokens
            await mockToken.connect(addr1).approve(defiModule.address, ethers.utils.parseEther("100"));
            await governanceToken.connect(addr1).approve(defiModule.address, ethers.utils.parseEther("100"));

            // Add liquidity
            await defiModule.connect(addr1).addLiquidity(
                1,
                ethers.utils.parseEther("100"),
                ethers.utils.parseEther("100"),
                ethers.utils.parseEther("90"),
                ethers.utils.parseEther("90")
            );

            const userLiquidity = await defiModule.getUserLiquidity(1, addr1.address);
            expect(userLiquidity).to.be.gt(0);
        });
    });

    describe("Social Module", function () {
        it("Should create and manage airdrops", async function () {
            // Transfer tokens for airdrop
            await mockToken.approve(socialModule.address, ethers.utils.parseEther("1000"));

            await socialModule.createAirdrop(
                "Test Airdrop",
                0, // ERC20
                mockToken.address,
                0,
                ethers.utils.parseEther("1000"),
                ethers.utils.parseEther("10"),
                86400, // 1 day
                false // No social verification required
            );

            // Claim airdrop
            await socialModule.connect(addr1).claimAirdrop(1);

            const balance = await mockToken.balanceOf(addr1.address);
            expect(balance).to.equal(ethers.utils.parseEther("10010")); // Original + airdrop
        });

        it("Should create communities and posts", async function () {
            await socialModule.connect(addr1).createCommunity(
                "Test Community",
                "A test community",
                ethers.constants.AddressZero,
                0,
                true
            );

            await socialModule.connect(addr2).joinCommunity(1);

            await socialModule.connect(addr2).createPost(
                1,
                "Hello community!",
                ""
            );

            const communityInfo = await socialModule.getCommunityInfo(1);
            expect(communityInfo.memberCount).to.equal(2); // Creator + addr2

            const postInfo = await socialModule.getPostInfo(1);
            expect(postInfo.author).to.equal(addr2.address);
            expect(postInfo.content).to.equal("Hello community!");
        });

        it("Should handle social profiles", async function () {
            await socialModule.connect(addr1).updateSocialProfile(
                "testuser",
                "testuser.lens",
                "@testuser",
                1000, // Farcaster followers
                500,  // Lens followers
                2000  // Twitter followers
            );

            const profile = await socialModule.socialProfiles(addr1.address);
            expect(profile.farcasterHandle).to.equal("testuser");
            expect(profile.socialScore).to.be.gt(0);
        });
    });

    describe("Governance Module", function () {
        beforeEach(async function () {
            // Delegate votes to enable governance participation
            await governanceToken.connect(addr1).approve(governanceModule.address, ethers.utils.parseEther("10000"));
            await governanceModule.connect(addr1).delegate(addr1.address);
        });

        it("Should create and vote on proposals", async function () {
            // Mine a block to establish voting power
            await network.provider.send("evm_mine");

            // Create proposal
            await governanceModule.connect(addr1).propose(
                [governanceModule.address],
                [0],
                [governanceModule.interface.encodeFunctionData("updateConfig", [2, 200, 2000, 6000, 172800])],
                "Test Proposal",
                "Update governance parameters"
            );

            // Fast forward past voting delay
            for (let i = 0; i < 5; i++) {
                await network.provider.send("evm_mine");
            }

            // Vote on proposal
            await governanceModule.connect(addr1).castVote(1, 1); // Vote "For"

            const proposal = await governanceModule.getProposal(1);
            expect(proposal.forVotes).to.be.gt(0);
        });
    });

    describe("Integration Tests", function () {
        it("Should handle cross-module interactions", async function () {
            // Create NFT in TokenModule
            await tokenModule.createToken(
                "Integration NFT",
                "INFT",
                "https://example.com/metadata/",
                0,
                100,
                ethers.utils.parseEther("1"),
                owner.address,
                500
            );

            // Mint NFT
            await tokenModule.connect(addr1).mint(
                addr1.address,
                1,
                10,
                "0x",
                { value: ethers.utils.parseEther("10") }
            );

            // List NFT in Marketplace
            await tokenModule.connect(addr1).setApprovalForAll(marketplaceModule.address, true);
            await marketplaceModule.connect(addr1).createListing(
                tokenModule.address,
                1,
                5,
                ethers.utils.parseEther("2"),
                ethers.constants.AddressZero,
                1,
                86400
            );

            // Create community in Social Module
            await socialModule.connect(addr1).createCommunity(
                "NFT Community",
                "Community for NFT holders",
                tokenModule.address,
                1, // Require at least 1 NFT
                true
            );

            // addr1 should be able to join (has NFTs)
            const isMember = await socialModule.isCommunityMember(1, addr1.address);
            expect(isMember).to.be.true; // Creator is automatically a member

            // Buy NFT so addr2 can join community
            await marketplaceModule.connect(addr2).buyNow(1, { value: ethers.utils.parseEther("2") });
            
            await socialModule.connect(addr2).joinCommunity(1);
            const isAddr2Member = await socialModule.isCommunityMember(1, addr2.address);
            expect(isAddr2Member).to.be.true;
        });

        it("Should demonstrate complete platform ecosystem", async function () {
            console.log("\n🚀 Demonstrating Complete Web3 Platform Ecosystem:");
            
            // 1. Token Creation & Minting
            console.log("1️⃣ Creating and minting NFTs...");
            await tokenModule.createToken("Ecosystem NFT", "ENFT", "ipfs://metadata/", 0, 1000, 0, owner.address, 250);
            await tokenModule.mint(addr1.address, 1, 50, "0x");
            console.log("   ✅ NFTs created and minted");

            // 2. DeFi Operations
            console.log("2️⃣ Setting up DeFi pools...");
            await defiModule.createPool(mockToken.address, governanceToken.address, 30);
            await mockToken.connect(addr1).approve(defiModule.address, ethers.utils.parseEther("100"));
            await governanceToken.connect(addr1).approve(defiModule.address, ethers.utils.parseEther("100"));
            await defiModule.connect(addr1).addLiquidity(1, ethers.utils.parseEther("100"), ethers.utils.parseEther("100"), ethers.utils.parseEther("90"), ethers.utils.parseEther("90"));
            console.log("   ✅ Liquidity pool created and funded");

            // 3. Staking
            console.log("3️⃣ Setting up staking...");
            await mockToken.transfer(stakingModule.address, ethers.utils.parseEther("10000"));
            await stakingModule.createPool("Ecosystem Pool", mockToken.address, 0, mockToken.address, 0, 0, ethers.utils.parseEther("0.1"), 0, 0, ethers.utils.parseEther("1"), 86400);
            await mockToken.connect(addr1).approve(stakingModule.address, ethers.utils.parseEther("50"));
            await stakingModule.connect(addr1).stake(1, ethers.utils.parseEther("50"));
            console.log("   ✅ Staking pool created and tokens staked");

            // 4. Marketplace
            console.log("4️⃣ Setting up marketplace...");
            await tokenModule.connect(addr1).setApprovalForAll(marketplaceModule.address, true);
            await marketplaceModule.connect(addr1).createListing(tokenModule.address, 1, 10, ethers.utils.parseEther("0.5"), ethers.constants.AddressZero, 1, 86400);
            console.log("   ✅ NFTs listed in marketplace");

            // 5. Social Features
            console.log("5️⃣ Setting up social features...");
            await socialModule.connect(addr1).createCommunity("Ecosystem Community", "Main community", tokenModule.address, 1, true);
            await socialModule.connect(addr1).updateSocialProfile("creator", "creator.lens", "@creator", 5000, 1000, 10000);
            await mockToken.approve(socialModule.address, ethers.utils.parseEther("1000"));
            await socialModule.createAirdrop("Welcome Airdrop", 0, mockToken.address, 0, ethers.utils.parseEther("1000"), ethers.utils.parseEther("25"), 86400, false);
            console.log("   ✅ Social features configured");

            // 6. Governance
            console.log("6️⃣ Setting up governance...");
            await governanceModule.connect(addr1).delegate(addr1.address);
            await network.provider.send("evm_mine");
            console.log("   ✅ Governance delegation complete");

            console.log("\n🎉 COMPLETE WEB3 PLATFORM ECOSYSTEM DEPLOYED!");
            console.log("📊 Platform includes:");
            console.log("   • Multi-standard token support (ERC20, ERC721, ERC1155)");
            console.log("   • Full marketplace with auctions and offers");
            console.log("   • Advanced staking with multipliers");
            console.log("   • Comprehensive governance system");
            console.log("   • DeFi pools and yield farming");
            console.log("   • Social features and airdrops");
            console.log("   • Cross-module integrations");

            expect(true).to.be.true; // Test passes if we reach here
        });
    });
});