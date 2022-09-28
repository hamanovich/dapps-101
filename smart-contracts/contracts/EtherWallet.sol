// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract EtherWallet {
    address public owner;

    modifier isOwner() {
        require(msg.sender == owner, "Only owner allowed to send");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function deposit() public payable {}

    function sendTo(address payable _to) public payable isOwner {
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
