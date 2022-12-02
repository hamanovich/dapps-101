// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error Voting__OnlyAdmin();
error Voting__OnlyVoters();
error Voting__VoteOnce();
error Voting__VoteUntil();
error Voting__ResultBefore();

contract Voting {
    mapping(address => bool) private voters;
    mapping(address => mapping(uint256 => bool)) private votes;

    struct Choice {
        uint256 id;
        string name;
        uint256 votes;
    }

    struct Ballot {
        uint256 id;
        string name;
        Choice[] choices;
        uint256 end;
    }

    mapping(uint256 => Ballot) ballots;
    uint256 nextBallotId = 1;
    address private immutable admin;

    event BallotCreated(
        uint256 indexed id,
        string name,
        Choice[] choices,
        uint256 end
    );

    modifier onlyAdmin() {
        if (msg.sender != admin) revert Voting__OnlyAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addVoters(address[] calldata _voters) external onlyAdmin {
        for (uint256 i; i < _voters.length; i++) {
            voters[_voters[i]] = true;
        }
    }

    function createBallot(
        string memory name,
        string[] memory choices,
        uint256 offset
    ) external onlyAdmin {
        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].name = name;
        ballots[nextBallotId].end = block.timestamp + offset;

        for (uint256 i; i < choices.length; i++) {
            ballots[nextBallotId].choices.push(Choice(i, choices[i], 0));
        }

        emit BallotCreated(
            nextBallotId,
            name,
            ballots[nextBallotId].choices,
            block.timestamp + offset
        );
    }

    function vote(uint256 ballotId, uint256 choiceId) external {
        if (!voters[msg.sender]) revert Voting__OnlyVoters();
        if (votes[msg.sender][ballotId]) revert Voting__VoteOnce();
        if (ballots[ballotId].end <= block.timestamp)
            revert Voting__VoteUntil();
        votes[msg.sender][ballotId] = true;
        ballots[ballotId].choices[choiceId].votes++;
    }

    function results(uint256 ballotId) external view returns (Choice[] memory) {
        if (block.timestamp < ballots[ballotId].end)
            revert Voting__ResultBefore();
        return ballots[ballotId].choices;
    }

    function getVoter(address _voter) external view returns (bool) {
        return voters[_voter];
    }

    function getBallot(uint256 _id) external view returns (Ballot memory) {
        return ballots[_id];
    }
}
