// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HieudzToken.sol";

contract Vendor {
    HieudzToken public token;
    // Đặt tỷ lệ quy đổi: 1 ETH mua được 100 token
    uint256 public constant tokensPerEth = 100;

    event BoughtTokens(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event SoldTokens(address indexed seller, uint256 tokenAmount, uint256 ethAmount);

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Vendor: invalid token address");
        token = HieudzToken(tokenAddress);
    }

    // Hàm mua token bằng cách gửi ETH
    function buyTokens() public payable {
        require(msg.value > 0, "Vendor: Send ETH to buy tokens");
        uint256 tokenAmount = msg.value * tokensPerEth;
        uint256 vendorBalance = token.balanceOf(address(this));
        require(vendorBalance >= tokenAmount, "Vendor: Not enough tokens in contract");

        bool sent = token.transfer(msg.sender, tokenAmount);
        require(sent, "Vendor: Failed to transfer tokens");

        emit BoughtTokens(msg.sender, msg.value, tokenAmount);
    }

    // Hàm bán token để nhận ETH
    // Người dùng cần approve token cho hợp đồng Vendor trước khi gọi hàm này
    function sellTokens(uint256 tokenAmount) public {
        require(tokenAmount > 0, "Vendor: Specify an amount of token to sell");

        // Tính số ETH dựa trên tỷ lệ quy đổi
        uint256 ethAmount = tokenAmount / tokensPerEth;
        require(address(this).balance >= ethAmount, "Vendor: Insufficient ETH in contract");

        // Chuyển token từ người bán về hợp đồng Vendor
        bool received = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(received, "Vendor: Failed to transfer tokens from seller");

        // Chuyển ETH về cho người bán
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "Vendor: Failed to send ETH");

        emit SoldTokens(msg.sender, tokenAmount, ethAmount);
    }

    // Hàm rút ETH (nên hạn chế chỉ chủ hợp đồng mới gọi được)
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Hàm nhận ETH khi gửi trực tiếp
    receive() external payable {}
}

