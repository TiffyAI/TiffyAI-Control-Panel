// connect.js

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

let web3;
let userAccount;

// Elegant popup function
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.remove("hidden");
  popup.classList.add("visible");

  setTimeout(() => {
    popup.classList.remove("visible");
    popup.classList.add("hidden");
  }, 3500);
}

document.getElementById("connectButton").addEventListener("click", async () => {
  try {
    showPopup("Connecting to wallet...");

    // Try injected wallet first (MetaMask, Trust Wallet desktop)
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
    } else {
      // Fallback to WalletConnect
      const provider = new WalletConnectProvider({
        rpc: {
          97: "https://data-seed-prebsc-1-s1.binance.org:8545", // BSC Testnet
        },
      });

      await provider.enable();
      web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
    }

    if (userAccount) {
      document.getElementById("walletStatus").innerText = "Wallet Account Activated";
      document.getElementById("balanceSection").classList.remove("hidden");
      document.getElementById("actionSection").classList.remove("hidden");
      showPopup("Wallet Connected Successfully!");
    } else {
      showPopup("No wallet account detected.");
    }
  } catch (err) {
    console.error(err);
    showPopup("Connection Failed: " + err.message);
  }
});
