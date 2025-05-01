const connectButton = document.getElementById("connectButton");
const walletStatus = document.getElementById("walletStatus");
const balanceSection = document.getElementById("balanceSection");
const actionSection = document.getElementById("actionSection");

async function connectWallet() {
  document.getElementById("loading").classList.remove("hidden");

  try {
    if (window.ethereum) {
      // Try MetaMask or Trust Wallet
      const provider = window.ethereum;
      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const wallet = accounts[0];
      displayWallet(wallet);
      fetchTiffyBalance(wallet, web3);
    } else {
      // Try WalletConnect (fallback)
      showPopup("No injected wallet found. Please install MetaMask or Trust Wallet.");
    }
  } catch (err) {
    console.error("Wallet connection error:", err);
    showPopup("Failed to connect wallet: " + err.message);
  } finally {
    document.getElementById("loading").classList.add("hidden");
  }
}

function displayWallet(address) {
  connectButton.classList.add("hidden");
  walletStatus.innerText = "Wallet Account Activated";
  balanceSection.classList.remove("hidden");
  actionSection.classList.remove("hidden");
}

async function fetchTiffyBalance(wallet, web3) {
  const contractAddress = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237"; // Your TIFFY contract
  const abi = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      type: "function",
    },
  ];

  const contract = new web3.eth.Contract(abi, contractAddress);
  const rawBalance = await contract.methods.balanceOf(wallet).call();
  const decimals = await contract.methods.decimals().call();
  const balance = (rawBalance / 10 ** decimals).toFixed(4);

  document.getElementById("balance").innerText = balance;
  updateUSD(balance);
}

async function updateUSD(tiffyBalance) {
  try {
    const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/bsc/0xDc7Fe4471eCD20d0af908A0952BA726131381099");
    const data = await res.json();
    const price = parseFloat(data?.pair?.priceUsd || 0);
    const value = (price * tiffyBalance).toFixed(2);
    document.getElementById("usdValue").innerText = value;
  } catch {
    document.getElementById("usdValue").innerText = "Unavailable";
  }
}

connectButton.addEventListener("click", connectWallet);
