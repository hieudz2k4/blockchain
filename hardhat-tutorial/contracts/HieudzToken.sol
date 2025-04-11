pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HieudzToken is ERC20 {
    constructor(address[] memory recipients) ERC20("HieudzToken", "HIEUDZ") {
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], 1000000 * 10 ** decimals());
        }
    }
}
