import { ethers } from "ethers";

// ABI của Vendor contract (chỉ lấy các hàm cần thiết)
export const vendorAbi = [
  "function buyTokens() public payable",
  "function sellTokens(uint256 tokenAmount) public",
  "event BoughtTokens(address indexed buyer, uint256 ethAmount, uint256 tokenAmount)",
  "event SoldTokens(address indexed seller, uint256 tokenAmount, uint256 ethAmount)",
];

// Cập nhật Vendor contract address sau khi deploy
export const vendorAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
