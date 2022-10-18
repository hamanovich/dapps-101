// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Strings {
    function length(string memory str) external pure returns (uint256) {
        return bytes(str).length;
    }

    function concat(string memory str1, string memory str2)
        external
        pure
        returns (string memory)
    {
        bytes memory _str1 = bytes(str1);
        bytes memory _str2 = bytes(str2);
        string memory str = new string(_str1.length + _str2.length);
        bytes memory str_bytes = bytes(str);

        uint256 j;

        for (uint256 i; i < _str1.length; i++) {
            str_bytes[j] = _str1[i];
            j++;
        }

        for (uint256 i; i < _str2.length; i++) {
            str_bytes[j] = _str2[i];
            j++;
        }

        return string(str_bytes);
    }
}
