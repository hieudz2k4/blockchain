const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const recipients = [deployer.address, deployer.address];

  // Deploy HieudzToken
  const HieudzTokenFactory = await ethers.getContractFactory("HieudzToken");
  const token = await HieudzTokenFactory.deploy(recipients);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("HieudzToken deployed at:", tokenAddress);

  // Deploy Vendor
  const VendorFactory = await ethers.getContractFactory("Vendor");
  const vendor = await VendorFactory.deploy(tokenAddress);
  await vendor.waitForDeployment();
  const vendorAddress = await vendor.getAddress();
  console.log("Vendor deployed at:", vendorAddress);

  // Transfer tokens to Vendor
  const decimals = await token.decimals();
  const tokensForVendor = ethers.parseUnits("500000", decimals);
  const tx = await token.transfer(vendorAddress, tokensForVendor);
  await tx.wait();

  console.log("✅ Transferred tokens to Vendor");
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
