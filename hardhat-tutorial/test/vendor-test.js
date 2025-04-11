const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vendor Contract", function () {
  let token, vendor, owner, addr1;
  const tokensPerEth = 100;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Triển khai HieudzToken: mint cho owner (đầu tiên) và owner (cho vendor test)
    const recipients = [owner.address, owner.address];
    const HieudzTokenFactory = await ethers.getContractFactory("HieudzToken");
    token = await HieudzTokenFactory.deploy(recipients);
    await token.deployed();

    // Triển khai Vendor
    const VendorFactory = await ethers.getContractFactory("Vendor");
    vendor = await VendorFactory.deploy(token.address);
    await vendor.deployed();

    // Chuyển token cho Vendor
    const tokensForVendor = ethers.utils.parseUnits("500000", 18);
    await token.transfer(vendor.address, tokensForVendor);
  });

  it("should allow user to buy tokens with ETH", async function () {
    // addr1 gửi 1 ETH để mua token
    const ethToSend = ethers.utils.parseEther("1");
    const expectedTokenAmount = ethToSend.mul(tokensPerEth);

    await expect(vendor.connect(addr1).buyTokens({ value: ethToSend }))
      .to.emit(vendor, "BoughtTokens")
      .withArgs(addr1.address, ethToSend, expectedTokenAmount);

    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.equal(expectedTokenAmount);
  });

  it("should allow user to sell tokens for ETH", async function () {
    // addr1 mua token trước
    const ethToSend = ethers.utils.parseEther("1");
    await vendor.connect(addr1).buyTokens({ value: ethToSend });
    const tokenAmount = ethToSend.mul(tokensPerEth);

    // addr1 cần approve token cho Vendor
    await token.connect(addr1).approve(vendor.address, tokenAmount);

    // Lấy số dư ETH ban đầu của addr1
    const initialEthBalance = await ethers.provider.getBalance(addr1.address);

    // Thực hiện bán token
    const tx = await vendor.connect(addr1).sellTokens(tokenAmount);
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const finalEthBalance = await ethers.provider.getBalance(addr1.address);
    // addr1 nhận lại 1 ETH trừ gas phí (dùng so sánh gần đúng)
    expect(finalEthBalance).to.be.closeTo(
      initialEthBalance.add(ethToSend).sub(gasUsed),
      ethers.utils.parseEther("0.001")
    );
  });
});
