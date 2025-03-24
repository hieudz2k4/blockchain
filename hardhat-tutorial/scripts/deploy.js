const hre = require("hardhat");

async function main() {
  // Lấy danh sách các tài khoản từ Hardhat node
  const signers = await hre.ethers.getSigners();

  // Chọn 2 tài khoản mà bạn muốn cung cấp 1.000 HIEUDZ mỗi người (có thể bao gồm deployer nếu cần)
  // Ví dụ: sử dụng tất cả các tài khoản có sẵn (Hardhat node mặc định cung cấp 20 tài khoản)
  const recipients = signers.map((signer) => signer.address);

  console.log("Danh sách địa chỉ nhận token:", recipients);

  // Lấy contract factory và deploy hợp đồng với mảng địa chỉ
  const HieudzToken = await hre.ethers.getContractFactory("HieudzToken");
  const token = await HieudzToken.deploy(recipients);

  await token.waitForDeployment();
  console.log("HieudzToken deployed at:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
