// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title GovernanceModule
 * @dev Comprehensive governance system with voting, proposals, and treasury management
 */
contract GovernanceModule is AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    // Proposal states
    enum ProposalState { Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired, Executed }
    
    // Vote types
    enum VoteType { Against, For, Abstain }
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool canceled;
        bool executed;
        uint256 eta; // Execution time for timelock
        mapping(address => Receipt) receipts;
    }
    
    struct Receipt {
        bool hasVoted;
        VoteType vote;
        uint256 votes;
        string reason;
    }
    
    // Governance parameters
    struct GovernanceConfig {
        uint256 votingDelay; // Blocks between proposal and vote start
        uint256 votingPeriod; // Voting duration in blocks
        uint256 proposalThreshold; // Tokens needed to propose
        uint256 quorumVotes; // Minimum votes needed for quorum
        uint256 timelockDelay; // Delay before execution
        address governanceToken; // Token used for voting
        bool requireTokenHolding; // Whether proposals require token holding
    }
    
    // Storage
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public latestProposalIds;
    
    uint256 public proposalCount;
    GovernanceConfig public config;
    
    // Treasury
    mapping(address => uint256) public treasuryBalances; // token => balance
    
    // Delegation
    mapping(address => address) public delegates;
    mapping(address => uint256) public delegateVotes;
    mapping(address => mapping(uint256 => uint256)) public checkpoints;
    mapping(address => uint256) public numCheckpoints;
    
    // Events
    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        string title,
        string description,
        uint256 startBlock,
        uint256 endBlock
    );
    
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        VoteType vote,
        uint256 votes,
        string reason
    );
    
    event ProposalCanceled(uint256 indexed id);
    event ProposalQueued(uint256 indexed id, uint256 eta);
    event ProposalExecuted(uint256 indexed id);
    
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);
    
    constructor(
        address governanceToken,
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 quorumVotes,
        uint256 timelockDelay
    ) {
        require(governanceToken != address(0), "Invalid governance token");
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
        _grantRole(EXECUTOR_ROLE, msg.sender);
        
        config = GovernanceConfig({
            votingDelay: votingDelay,
            votingPeriod: votingPeriod,
            proposalThreshold: proposalThreshold,
            quorumVotes: quorumVotes,
            timelockDelay: timelockDelay,
            governanceToken: governanceToken,
            requireTokenHolding: true
        });
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory title,
        string memory description
    ) external returns (uint256) {
        require(targets.length == values.length && targets.length == calldatas.length, "Proposal function information mismatch");
        require(targets.length > 0, "Must provide actions");
        require(targets.length <= 10, "Too many actions");
        
        // Check proposer qualifications
        if (config.requireTokenHolding) {
            require(getVotes(msg.sender, block.number - 1) >= config.proposalThreshold, "Insufficient voting power");
        }
        
        // Check for existing active proposal
        uint256 latestProposalId = latestProposalIds[msg.sender];
        if (latestProposalId != 0) {
            ProposalState proposalState = state(latestProposalId);
            require(proposalState != ProposalState.Active && proposalState != ProposalState.Pending, "One live proposal per proposer");
        }
        
        uint256 startBlock = block.number + config.votingDelay;
        uint256 endBlock = startBlock + config.votingPeriod;
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.targets = targets;
        newProposal.values = values;
        newProposal.calldatas = calldatas;
        newProposal.startBlock = startBlock;
        newProposal.endBlock = endBlock;
        
        latestProposalIds[msg.sender] = proposalId;
        
        emit ProposalCreated(proposalId, msg.sender, title, description, startBlock, endBlock);
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 proposalId, VoteType vote) external {
        _castVote(msg.sender, proposalId, vote, "");
    }
    
    /**
     * @dev Cast a vote with reason
     */
    function castVoteWithReason(uint256 proposalId, VoteType vote, string calldata reason) external {
        _castVote(msg.sender, proposalId, vote, reason);
    }
    
    /**
     * @dev Internal vote casting logic
     */
    function _castVote(address voter, uint256 proposalId, VoteType vote, string memory reason) internal {
        require(state(proposalId) == ProposalState.Active, "Voting is closed");
        
        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(!receipt.hasVoted, "Voter already voted");
        
        uint256 votes = getVotes(voter, proposal.startBlock);
        require(votes > 0, "No voting power");
        
        receipt.hasVoted = true;
        receipt.vote = vote;
        receipt.votes = votes;
        receipt.reason = reason;
        
        if (vote == VoteType.Against) {
            proposal.againstVotes += votes;
        } else if (vote == VoteType.For) {
            proposal.forVotes += votes;
        } else {
            proposal.abstainVotes += votes;
        }
        
        emit VoteCast(voter, proposalId, vote, votes, reason);
    }
    
    /**
     * @dev Queue a successful proposal for execution
     */
    function queue(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Proposal cannot be queued");
        
        Proposal storage proposal = proposals[proposalId];
        uint256 eta = block.timestamp + config.timelockDelay;
        proposal.eta = eta;
        
        emit ProposalQueued(proposalId, eta);
    }
    
    /**
     * @dev Execute a queued proposal
     */
    function execute(uint256 proposalId) external payable nonReentrant {
        require(state(proposalId) == ProposalState.Queued, "Proposal cannot be executed");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.eta, "Timelock not met");
        require(block.timestamp <= proposal.eta + 14 days, "Transaction stale");
        
        proposal.executed = true;
        
        // Execute proposal actions
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success,) = proposal.targets[i].call{value: proposal.values[i]}(proposal.calldatas[i]);
            require(success, "Execution failed");
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal
     */
    function cancel(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer ||
            hasRole(ADMIN_ROLE, msg.sender) ||
            getVotes(proposal.proposer, block.number - 1) < config.proposalThreshold,
            "Cannot cancel"
        );
        
        require(state(proposalId) != ProposalState.Executed, "Cannot cancel executed proposal");
        
        proposal.canceled = true;
        
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @dev Get the state of a proposal
     */
    function state(uint256 proposalId) public view returns (ProposalState) {
        require(proposalCount >= proposalId && proposalId > 0, "Invalid proposal id");
        
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return ProposalState.Active;
        } else if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < config.quorumVotes) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + 14 days) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }
    
    /**
     * @dev Delegate votes to another address
     */
    function delegate(address delegatee) external {
        _delegate(msg.sender, delegatee);
    }
    
    /**
     * @dev Internal delegation logic
     */
    function _delegate(address delegator, address delegatee) internal {
        address currentDelegate = delegates[delegator];
        uint256 delegatorBalance = IERC20(config.governanceToken).balanceOf(delegator);
        
        delegates[delegator] = delegatee;
        
        emit DelegateChanged(delegator, currentDelegate, delegatee);
        
        _moveDelegates(currentDelegate, delegatee, delegatorBalance);
    }
    
    /**
     * @dev Move delegate votes
     */
    function _moveDelegates(address srcRep, address dstRep, uint256 amount) internal {
        if (srcRep != dstRep && amount > 0) {
            if (srcRep != address(0)) {
                uint256 srcRepNum = numCheckpoints[srcRep];
                uint256 srcRepOld = srcRepNum > 0 ? checkpoints[srcRep][srcRepNum - 1] : 0;
                uint256 srcRepNew = srcRepOld - amount;
                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }
            
            if (dstRep != address(0)) {
                uint256 dstRepNum = numCheckpoints[dstRep];
                uint256 dstRepOld = dstRepNum > 0 ? checkpoints[dstRep][dstRepNum - 1] : 0;
                uint256 dstRepNew = dstRepOld + amount;
                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
        }
    }
    
    /**
     * @dev Write a checkpoint for delegate votes
     */
    function _writeCheckpoint(address delegatee, uint256 nCheckpoints, uint256 oldVotes, uint256 newVotes) internal {
        if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1] == oldVotes) {
            checkpoints[delegatee][nCheckpoints - 1] = newVotes;
        } else {
            checkpoints[delegatee][nCheckpoints] = newVotes;
            numCheckpoints[delegatee] = nCheckpoints + 1;
        }
        
        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }
    
    /**
     * @dev Get votes for an account at a specific block
     */
    function getVotes(address account, uint256 blockNumber) public view returns (uint256) {
        require(blockNumber < block.number, "Not yet determined");
        
        uint256 nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }
        
        // Most recent checkpoint
        if (checkpoints[account][nCheckpoints - 1] <= blockNumber) {
            return checkpoints[account][nCheckpoints - 1];
        }
        
        // Implicit zero balance
        if (checkpoints[account][0] > blockNumber) {
            return 0;
        }
        
        // Binary search
        uint256 lower = 0;
        uint256 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2;
            if (checkpoints[account][center] == blockNumber) {
                return checkpoints[account][center];
            } else if (checkpoints[account][center] < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return checkpoints[account][lower];
    }
    
    /**
     * @dev Update governance configuration
     */
    function updateConfig(
        uint256 votingDelay,
        uint256 votingPeriod,
        uint256 proposalThreshold,
        uint256 quorumVotes,
        uint256 timelockDelay
    ) external onlyRole(ADMIN_ROLE) {
        config.votingDelay = votingDelay;
        config.votingPeriod = votingPeriod;
        config.proposalThreshold = proposalThreshold;
        config.quorumVotes = quorumVotes;
        config.timelockDelay = timelockDelay;
    }
    
    /**
     * @dev Deposit funds to treasury
     */
    function depositToTreasury(address token, uint256 amount) external payable {
        if (token == address(0)) {
            // ETH deposit
            require(msg.value == amount, "Incorrect ETH amount");
            treasuryBalances[token] += amount;
        } else {
            // ERC20 deposit
            require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
            treasuryBalances[token] += amount;
        }
    }
    
    /**
     * @dev Withdraw from treasury (via governance proposal)
     */
    function treasuryWithdraw(address token, uint256 amount, address to) external onlyRole(EXECUTOR_ROLE) {
        require(treasuryBalances[token] >= amount, "Insufficient treasury balance");
        
        treasuryBalances[token] -= amount;
        
        if (token == address(0)) {
            payable(to).transfer(amount);
        } else {
            IERC20(token).transfer(to, amount);
        }
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 startBlock,
        uint256 endBlock,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        bool canceled,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.startBlock,
            proposal.endBlock,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.canceled,
            proposal.executed
        );
    }
    
    /**
     * @dev Get proposal actions
     */
    function getActions(uint256 proposalId) external view returns (
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.targets, proposal.values, proposal.calldatas);
    }
    
    /**
     * @dev Get receipt for a voter
     */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory) {
        return proposals[proposalId].receipts[voter];
    }
    
    // Receive ETH for treasury
    function depositETH() external payable {
        treasuryBalances[address(0)] += msg.value;
    }
}