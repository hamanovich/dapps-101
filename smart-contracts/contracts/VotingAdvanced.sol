// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error Voting__OnlyOwner();
error Voting__WithdrawComissionFailed();
error Voting__Started();
error Voting__NotStarted();
error Voting__Ended();
error Voting__NotOver();
error Voting__NotWinner();
error Voting__AlreadyWithdrawn();
error Voting__NoCandidate();

contract VotingAdvanced {
    address private immutable owner;
    uint128 private counter;
    uint8 private immutable comission;

    struct Candidate {
        uint256 balance;
        bool isExistOnThisVoting;
    }

    struct Voting {
        bool started;
        address winner;
        uint256 startDate;
        uint256 winnerBalance;
        uint256 bank;
        uint256 period;
        mapping(address => Candidate) candidates;
    }

    mapping(uint256 => Voting) private votings;

    event candidateInfo(
        uint256 indexed votingID,
        address indexed candidate,
        bool exists
    );

    modifier onlyOwner() {
        if (msg.sender != owner) revert Voting__OnlyOwner();
        _;
    }

    constructor(uint8 _comission) {
        owner = msg.sender;
        comission = _comission;
    }

    function vote(uint8 _votingID, address _candidate) external payable {
        if (!votings[_votingID].started) revert Voting__NotStarted();
        if (
            votings[_votingID].startDate + votings[_votingID].period <=
            block.timestamp
        ) revert Voting__Ended();
        if (!checkCandidate(_votingID, _candidate))
            revert Voting__NoCandidate();

        votings[_votingID].candidates[_candidate].balance += msg.value;
        votings[_votingID].bank += msg.value;

        if (
            votings[_votingID].candidates[_candidate].balance >
            votings[_votingID].winnerBalance
        ) {
            votings[_votingID].winnerBalance = votings[_votingID]
                .candidates[_candidate]
                .balance;
            votings[_votingID].winner = _candidate;
        }
    }

    function withdraw(uint256 _votingID) external {
        if (!votings[_votingID].started) revert Voting__NotStarted();
        if (
            votings[_votingID].startDate + votings[_votingID].period >=
            block.timestamp
        ) revert Voting__NotOver();
        if (msg.sender != votings[_votingID].winner) revert Voting__NotWinner();
        if (votings[_votingID].bank == 0) revert Voting__AlreadyWithdrawn();

        uint256 amount = votings[_votingID].bank;
        uint256 ownersComission = (comission * amount) / 100;
        uint256 clearAmount = amount - ownersComission;
        votings[_votingID].bank = 0;

        (bool send, ) = payable(owner).call{value: ownersComission}("");
        if (!send) revert Voting__WithdrawComissionFailed();

        (bool cleared, ) = payable(msg.sender).call{value: clearAmount}("");
        if (!cleared) revert Voting__WithdrawComissionFailed();
    }

    function getVotingInfo(uint256 _votingID)
        external
        view
        returns (
            bool,
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            votings[_votingID].started,
            votings[_votingID].startDate,
            votings[_votingID].period,
            votings[_votingID].winnerBalance,
            votings[_votingID].bank,
            votings[_votingID].winner
        );
    }

    function checkCandidate(uint256 _votingID, address _candidate)
        public
        view
        returns (bool)
    {
        return (votings[_votingID].candidates[_candidate].isExistOnThisVoting);
    }

    function addVoting(uint256 _period, address[] calldata _candidates)
        external
        onlyOwner
    {
        votings[counter].period = _period;

        for (uint256 i = 0; i < _candidates.length; i++) {
            addCandidate(counter, _candidates[i]);
        }

        counter++;
    }

    function startVoting(uint256 _votingID) external onlyOwner {
        votings[_votingID].started = true;
        votings[_votingID].startDate = block.timestamp;
    }

    function editVotingPeriod(uint256 _votingID, uint256 _newPeriod)
        external
        onlyOwner
    {
        if (votings[_votingID].started) revert Voting__Started();
        votings[_votingID].period = _newPeriod;
    }

    function addCandidate(uint256 _votingID, address _candidate)
        public
        onlyOwner
    {
        if (votings[_votingID].started) revert Voting__Started();
        votings[_votingID].candidates[_candidate].isExistOnThisVoting = true;
        emit candidateInfo(_votingID, _candidate, true);
    }

    function deleteCandidate(uint256 _votingID, address _candidate)
        external
        onlyOwner
    {
        if (votings[_votingID].started) revert Voting__Started();
        votings[_votingID].candidates[_candidate].isExistOnThisVoting = false;
        emit candidateInfo(_votingID, _candidate, false);
    }
}
