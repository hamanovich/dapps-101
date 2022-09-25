// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract SimpleStorage {
    string public data;

    function setData(string memory str) public {
        data = str;
    }

    function getData() public view returns (string memory) {
        return data;
    }
}
