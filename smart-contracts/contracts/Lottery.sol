// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error Lottery__WrongState();
error Lotter__WrongFeeValue();
error Lottery__OnlyAdmin();
error Lottery_WithdrawFailure();

contract Lottery_2 {
    enum State {
        IDLE,
        BETTING
    }
    address payable[] private players;
    State private currentState = State.IDLE;
    uint256 private betCount;
    uint256 private betSize;
    uint256 private fee = 10;
    address private admin;

    modifier inState(State state) {
        if (state != currentState) revert Lottery__WrongState();
        _;
    }

    modifier onlyAdmin() {
        if (msg.sender != admin) revert Lottery__OnlyAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createBet(uint256 count, uint256 size)
        external
        inState(State.IDLE)
        onlyAdmin
    {
        betCount = count;
        betSize = size;
        currentState = State.BETTING;
    }

    function alreadyBet(address sender) internal view returns (bool) {
        for (uint256 i; i < players.length; i++) {
            if (players[i] == sender) return true;
        }

        return false;
    }

    function bet() external payable inState(State.BETTING) {
        require(msg.value == betSize, "can only bet exactly the bet size");
        require(!alreadyBet(msg.sender), "already bet");
        players.push(payable(msg.sender));
        if (players.length == betCount) {
            uint256 winner = uint256(
                keccak256(abi.encodePacked(msg.sender, block.timestamp))
            ) % betCount;
            (bool sent, ) = players[winner].call{
                value: ((betSize * betCount) * (100 - fee)) / 100
            }("");
            require(sent);

            currentState = State.IDLE;
            delete players;
        }
    }

    function cancel() external inState(State.BETTING) onlyAdmin {
        for (uint256 i = 0; i < players.length; i++) {
            players[i].transfer(betSize);
        }
        delete players;
        currentState = State.IDLE;
    }

    function editFee(uint256 newFee) external {
        if (newFee < 1 || newFee > 99) revert Lotter__WrongFeeValue();
        fee = newFee;
    }

    function withdrawFee() external onlyAdmin {
        (bool sent, ) = admin.call{value: address(this).balance}("");
        if (!sent) revert Lottery_WithdrawFailure();
    }

    function getPlayers() external view returns (address payable[] memory) {
        return players;
    }
}
