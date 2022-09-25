// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract SimpleStorage {
    string public data;

    function set(string memory str) public {
         data =  str;
    }

    function get() public view returns(string memory) {
        return data;
    }
}