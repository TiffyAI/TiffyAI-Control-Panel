const connectButton = document.getElementById("connectButton");
const walletStatus = document.getElementById("walletStatus");
const balanceSection = document.getElementById("balanceSection");
const actionSection = document.getElementById("actionSection");
const popup = document.getElementById("popup");
const loading = document.getElementById("loading");

let currentAccount = null;

connectButton.addEventListener("click", async () => {
  showLoading("Connecting to wallet...");

  try {
    const provider = await getProvider();
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];

    walletStatus.innerText = "Wallet Account Activated";
    balanceSection.classList.remove("hidden");
    actionSection.classList.remove("hidden");

    hideLoading();
    showPopup("Wallet connected successfully!");

    // Fetch balance
    getBalance(currentAccount);

    // Disconnect handling
    provider.on("accountsChanged", () => {
      location.reload();
    });

  } catch (error) {
    hideLoading();
    showPopup("Failed to connect wallet");
    console.error("Connection error:", error);
  }
});

async function getProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) {
    return window.ethereum;
  } else if (window.ethereum && window.ethereum.isTrust) {
    return window.ethereum;
  } else if (window.bitkeep && window.bitkeep.ethereum) {
    return window.bitkeep.ethereum;
  } else if (window.BinanceChain) {
    return window.BinanceChain;
  } else {
    throw new Error("No supported wallet found.");
  }
}