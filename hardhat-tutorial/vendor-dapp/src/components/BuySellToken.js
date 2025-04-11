import React, { useState, useEffect } from "react";
import { BrowserProvider, parseEther, parseUnits, Contract } from "ethers";
import { vendorAbi, vendorAddress } from "../utils/vendor/vendorContract";

const BuySellToken = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vendorContract, setVendorContract] = useState(null);
  const [account, setAccount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [sellTokenAmount, setSellTokenAmount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const tempProvider = new BrowserProvider(window.ethereum);
        await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = await tempProvider.getSigner();
        const address = await tempSigner.getAddress();
        setProvider(tempProvider);
        setSigner(tempSigner);
        setAccount(address);

        const contract = new Contract(vendorAddress, vendorAbi, tempSigner);
        setVendorContract(contract);
      } catch (error) {
        console.error("Lỗi khi kết nối ví:", error);
      }
    } else {
      alert("Cài đặt MetaMask để kết nối ví!");
    }
  };

  const buyTokens = async () => {
    if (!vendorContract || !ethAmount) {
      alert("Vui lòng nhập số ETH cần dùng để mua token!");
      return;
    }
    try {
      const tx = await vendorContract.buyTokens({
        value: parseEther(ethAmount),
      });
      await tx.wait();
      alert("Mua token thành công!");
    } catch (error) {
      console.error("Giao dịch mua token thất bại:", error);
      alert("Giao dịch mua token thất bại!");
    }
  };

  const sellTokens = async () => {
    if (!vendorContract || !sellTokenAmount) {
      alert("Vui lòng nhập số token muốn bán!");
      return;
    }
    try {
      const tokenAmountWei = parseUnits(sellTokenAmount, 18);
      const tx = await vendorContract.sellTokens(tokenAmountWei);
      await tx.wait();
      alert("Bán token thành công!");
    } catch (error) {
      console.error("Giao dịch bán token thất bại:", error);
      alert("Giao dịch bán token thất bại!");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <h1>Vendor DApp</h1>
      {account ? (
        <>
          <p>
            <strong>Địa chỉ ví:</strong> {account}
          </p>

          <div style={{ marginTop: "20px" }}>
            <h3>Mua Token</h3>
            <input
              type="number"
              placeholder="Nhập số ETH"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={buyTokens}>Mua Token</button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Bán Token</h3>
            <input
              type="number"
              placeholder="Nhập số token muốn bán"
              value={sellTokenAmount}
              onChange={(e) => setSellTokenAmount(e.target.value)}
              style={{ marginRight: "10px" }}
            />
            <button onClick={sellTokens}>Bán Token</button>
          </div>
        </>
      ) : (
        <p>Đang kết nối ví...</p>
      )}
    </div>
  );
};

export default BuySellToken;
