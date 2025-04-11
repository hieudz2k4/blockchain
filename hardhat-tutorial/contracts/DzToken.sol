pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DzToken is ERC20, Ownable {
    uint256 public feePercent;

    event TransferWithFee(address indexed from, address indexed to, uint256 amountAfterFee, uint256 fee);
    event FeeUpdated(uint256 newFee);

    constructor(address[] memory recipients)
        ERC20("DzToken", "DZ")
        Ownable(msg.sender) 
    {
        feePercent = 10;
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], 1000 * 10 ** decimals());
        }
    }

    function transferWithFee(address recipient, uint256 amount) external returns (bool) {
        uint256 fee = (amount * feePercent) / 10000;
        uint256 amountAfterFee = amount - fee;
        _transfer(msg.sender, recipient, amountAfterFee);
        if (fee > 0) {
            _transfer(msg.sender, owner(), fee);
        }
        emit TransferWithFee(msg.sender, recipient, amountAfterFee, fee);
        return true;
    }

    function updateFeePercent(uint256 newFeePercent) external onlyOwner {
        feePercent = newFeePercent;
        emit FeeUpdated(newFeePercent);
    }
}
