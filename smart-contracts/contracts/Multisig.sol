// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

error MultiSig__TransferAlreadySent();
error MultiSig__NotSent();
error MultiSig__OnlyApprover();
error MultiSig__BalanceExceeded();

contract MultiSig {
    address[] private approvers;
    uint256 private immutable quorum;
    uint256 private nextId;

    struct Transfer {
        uint256 id;
        uint256 amount;
        address payable to;
        uint256 approvals;
        bool sent;
    }

    mapping(uint256 => Transfer) private transfers;
    mapping(address => mapping(uint256 => bool)) approvals;

    modifier onlyApprover() {
        bool allowed = false;
        for (uint256 i; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) allowed = true;
        }
        if (!allowed) revert MultiSig__OnlyApprover();
        _;
    }

    constructor(address[] memory _approvers, uint256 _quorum) payable {
        approvers = _approvers;
        quorum = _quorum;
    }

    function createTransfer(uint256 amount, address payable to)
        external
        onlyApprover
    {
        if (amount > getBalance()) revert MultiSig__BalanceExceeded();
        transfers[nextId] = Transfer(nextId, amount, to, 0, false);
        nextId++;
    }

    function sendTransfer(uint256 id) external payable onlyApprover {
        if (transfers[id].sent) revert MultiSig__TransferAlreadySent();

        if (transfers[id].approvals >= quorum) {
            transfers[id].sent = true;
            (bool sent, ) = transfers[id].to.call{value: transfers[id].amount}(
                ""
            );
            if (!sent) revert MultiSig__NotSent();

            return;
        }

        if (!approvals[msg.sender][id]) {
            approvals[msg.sender][id] = true;
            transfers[id].approvals++;
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTransfer(uint256 _id) external view returns (Transfer memory) {
        return transfers[_id];
    }

    function getApprovers() external view returns (address[] memory) {
        return approvers;
    }

    function getQuorom() external view returns (uint256) {
        return quorum;
    }
}
