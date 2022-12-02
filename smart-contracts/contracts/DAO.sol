// SPDX-License-Identifier: MIT

/**
 * DAO Contract:
 * 1. Collects investors money
 * 2. Keep track of investor contributions with shares
 * 3. Allow investors to transfer shares
 * 4. Allow investment proposals to be created and voted
 * 5. Execute successfull investment proposals (i.e. send money)
 */

pragma solidity 0.8.17;

error DAO__OnlyInvestors();
error DAO__OnlyAdmin();
error DAO_SendFailure();

contract DAO {
    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        uint256 end;
        bool executed;
    }
    mapping(address => bool) private investors;
    mapping(address => uint256) private shares;
    mapping(uint256 => Proposal) private proposals;
    mapping(address => mapping(uint256 => bool)) private votes;
    uint256 private totalShares;
    uint256 private availableFunds;
    uint256 private contributionEnd;
    uint256 private nextProposalId;
    uint256 private voteTime;
    uint256 private quorum;
    address private admin;

    modifier onlyInvestors() {
        if (!investors[msg.sender]) revert DAO__OnlyInvestors();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert DAO__OnlyAdmin();
        _;
    }

    constructor(
        uint256 _contributionTime,
        uint256 _voteTime,
        uint256 _quorum
    ) {
        require(
            _quorum > 0 && _quorum < 100,
            "quorum must be between 1 and 100"
        );
        contributionEnd = block.timestamp + _contributionTime;
        voteTime = _voteTime;
        quorum = _quorum;
        admin = msg.sender;
    }

    receive() external payable {
        availableFunds += msg.value;
    }

    function contribute() external payable {
        require(block.timestamp < contributionEnd, "Contribution is over");
        investors[msg.sender] = true;
        shares[msg.sender] += msg.value;
        totalShares += msg.value;
        availableFunds += msg.value;
    }

    function redeemShare(uint256 amount) external {
        require(shares[msg.sender] >= amount, "not enough shares");
        require(availableFunds >= amount, "not enough availableFunds");
        shares[msg.sender] -= amount;
        availableFunds -= amount;
        (bool sent, ) = msg.sender.call{value: amount}("");
        if (!sent) revert DAO_SendFailure();
    }

    function transferShare(uint256 amount, address to) external {
        require(shares[msg.sender] >= amount, "not enough shares");
        shares[msg.sender] -= amount;
        shares[to] += amount;
        investors[to] = true;
    }

    function createProposal(
        string memory name,
        uint256 amount,
        address payable recipient
    ) external onlyInvestors {
        require(availableFunds >= amount, "amount too big");
        proposals[nextProposalId] = Proposal(
            nextProposalId,
            name,
            amount,
            recipient,
            0,
            block.timestamp + voteTime,
            false
        );
        availableFunds -= amount;
        nextProposalId++;
    }

    function vote(uint256 proposalId) external onlyInvestors {
        Proposal storage proposal = proposals[proposalId];
        require(
            votes[msg.sender][proposalId] == false,
            "investor can only vote once for a proposal"
        );
        require(
            block.timestamp < proposal.end,
            "can only vote until proposal end date"
        );
        votes[msg.sender][proposalId] = true;
        proposal.votes += shares[msg.sender];
    }

    function executeProposal(uint256 proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[proposalId];
        require(
            block.timestamp >= proposal.end,
            "Cannot execute a proposal before end date"
        );
        require(proposal.executed == false, "Proposal already executed");
        require(
            (proposal.votes / totalShares) * 100 >= quorum,
            "Cannot execute a proposal with votes below quorum"
        );
        _transferEther(proposal.amount, proposal.recipient);
    }

    function withdrawEther(uint256 amount, address payable to)
        external
        onlyAdmin
    {
        _transferEther(amount, to);
    }

    function _transferEther(uint256 amount, address payable to) internal {
        require(amount <= availableFunds, "not enough availableFunds");
        availableFunds -= amount;
        (bool sent, ) = to.call{value: amount}("");
        if (!sent) revert DAO_SendFailure();
    }

    function getInvestor(address _investor) external view returns (bool) {
        return investors[_investor];
    }

    function getInvestorShares(address _investor)
        external
        view
        returns (uint256)
    {
        return shares[_investor];
    }

    function getProposal(uint256 _proposal)
        external
        view
        returns (Proposal memory)
    {
        return proposals[_proposal];
    }

    function getTotalShares() external view returns (uint256) {
        return totalShares;
    }

    function getAvailableFunds() external view returns (uint256) {
        return availableFunds;
    }
}
