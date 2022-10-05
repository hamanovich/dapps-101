// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract Escrow {
    address public payer;
    address payable public payee;
    address public lawyer;
    uint256 public amount;

    constructor(
        address _payer,
        address payable _payee,
        uint256 _amount
    ) {
        payer = _payer;
        payee = _payee;
        lawyer = msg.sender;
        amount = _amount;
    }

    function deposit() public payable {
        require(msg.sender == payer, "Sender must be a payer");
        require(address(this).balance <= amount);
    }

    function release() public {
        require(
            address(this).balance == amount,
            "Cannot release funds before full amount is sent"
        );
        require(msg.sender == lawyer, "Only lawyer can release funds");
        (bool sent, ) = payee.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
