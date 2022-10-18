// SPDX-License-Identifier: MIT

// candidates = [0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db,0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB];
// secret = 0x7365637265740000000000000000000000000000000000000000000000000000
// _hashedVote (1st candidate) = 0x52b68b79f495686f3987a1a8ae338e6828e3397d66061eaf1e31210578eece3e
// _hashedVote (2nd candidate) = 0x268d07d765ff80b8a5e57a6d5bd7c9b56ab9f57891263d1bd06eceeb45e45e32

pragma solidity 0.8.17;

error CommitReveal__VotingStopped(string message);
error CommitReveal__CommitEqual(string message);

contract CommitReveal {
    address[] public candidates;

    constructor(address[] memory _candidates) {
        candidates = _candidates;
    }

    mapping(address => bytes32) public commits;
    mapping(address => uint256) public votes;
    bool votingStopped;

    function commitVote(bytes32 _hashedVote) external {
        if (votingStopped)
            revert CommitReveal__VotingStopped("Voting should be active");

        if (commits[msg.sender] != bytes32(0))
            revert CommitReveal__CommitEqual("Commits already exists");

        commits[msg.sender] = _hashedVote;
    }

    function revealVote(address _candidate, bytes32 _secret) external {
        if (!votingStopped)
            revert CommitReveal__VotingStopped("Voting is not stopped");

        bytes32 commit = keccak256(
            abi.encodePacked(_candidate, _secret, msg.sender)
        );
        if (commit != commits[msg.sender])
            revert CommitReveal__CommitEqual("Commits are not equal");

        delete commits[msg.sender];
        votes[_candidate]++;
    }

    function stopVoting() external {
        if (votingStopped)
            revert CommitReveal__VotingStopped("Voting already stopped");

        votingStopped = true;
    }
}
