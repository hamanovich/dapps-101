// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract AdvancedStorage {
    uint256[] public ids;

    modifier limit(uint256 position) {
        require(position <= getLength(), "Max position exceeded");
        _;
    }

    function add(uint256 id) public {
        ids.push(id);
    }

    function getValue(uint256 index) public view limit(index) returns (uint256) {
        return ids[index];
    }

    function getLength() public view returns (uint256) {
        return ids.length;
    }

    function getAll() public view returns (uint256[] memory) {
        return ids;
    }
}
