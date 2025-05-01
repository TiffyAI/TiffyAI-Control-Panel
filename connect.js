document.getElementById("connectButton").addEventListener("click", async () => {
  try {
    showPopup("Attempting wallet connection...");

    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      showPopup("Wallet Connected Successfully!");
      document.getElementById("walletStatus").innerText = "Wallet Account Activated";
      document.getElementById("balanceSection").classList.remove("hidden");
      document.getElementById("actionSection").classList.remove("hidden");
    } else {
      // If MetaMask not found, fallback to wallet connect
      showPopup("MetaMask not found, trying WalletConnect...");

      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.8/dist/umd/index.min.js";
      document.body.appendChild(script);

      script.onload = async () => {
        const provider = new WalletConnectProvider.default({
          rpc: {
            97: "https://data-seed-prebsc-1-s1.binance.org:8545"
          },
        });

        await provider.enable();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        if (accounts.length > 0) {
          showPopup("WalletConnect Connected!");
          document.getElementById("walletStatus").innerText = "Wallet Account Activated";
          document.getElementById("balanceSection").classList.remove("hidden");
          document.getElementById("actionSection").classList.remove("hidden");
        }
      };
    }
  } catch (error) {
    showPopup("Connection Failed: " + error.message);
  }
});
