// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.9 <0.9.0;

contract CRUD {
    struct User {
        uint256 id;
        string name;
    }

    User[] public users;
    uint256 public _id = 1;

    function create(string memory name) public {
        users.push(User(_id, name));
        _id++;
    }

    function read(uint256 id) public view returns (uint256, string memory) {
        uint256 i = _find(id);
        return (users[i].id, users[i].name);
    }

    function update(uint256 id, string memory name) public {
        users[_find(id)].name = name;
    }

    function destroy(uint256 id) public {
        delete users[_find(id)];
    }

    function _find(uint256 id) internal view returns (uint256) {
        for (uint256 i; i < users.length; i++) {
            if (users[i].id == id) {
                return i;
            }
        }

        revert("User doesn't exist!");
    }
}
