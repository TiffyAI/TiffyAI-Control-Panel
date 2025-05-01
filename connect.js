import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

const CONTRACT_ADDRESS = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237"; // Update if different
const CONTRACT_ABI = [
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

let web3;
let userAccount;
let contract;

// Elegant popup
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

// Short address helper
function shortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// Get TIFFY balance
async function updateBalance() {
  try {
    const balance = await contract.methods.balanceOf(userAccount).call();
    const tiffy = web3.utils.fromWei(balance, "ether");
    document.getElementById("balance").innerText = parseFloat(tiffy).toFixed(2);

    // Fake USD for now (can replace with live fetch)
    const pricePerToken = 12; // Example static price
    document.getElementById("usdValue").innerText = `$${(tiffy * pricePerToken).toFixed(2)}`;
  } catch (err) {
    console.error("Balance error:", err);
    showPopup("Could not load balance");
  }
}

document.getElementById("connectButton").addEventListener("click", async () => {
  try {
    showPopup("Connecting to wallet...");

    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
    } else {
      const provider = new WalletConnectProvider({
        rpc: {
          97: "https://data-seed-prebsc-1-s1.binance.org:8545", // BSC Testnet
        },
      });
      await provider.enable();
      web3 = new Web3(provider);
    }

    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    if (!userAccount) return showPopup("No wallet detected");

    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    document.getElementById("walletStatus").innerText = `Connected: ${shortAddress(userAccount)}`;

    showPopup("Wallet Connected!");
    document.getElementById("balanceSection").classList.remove("hidden");
    document.getElementById("actionSection").classList.remove("hidden");

    await updateBalance();
  } catch (err) {
    console.error(err);
    showPopup("Connection failed");
  }
});
