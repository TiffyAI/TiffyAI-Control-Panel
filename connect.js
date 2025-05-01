<script type="module">
  import Web3 from 'https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js';
  import WalletConnectProvider from 'https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js';

  const connectBtn = document.getElementById("connectButton");
  const walletStatus = document.getElementById("walletStatus");
  const balanceDisplay = document.getElementById("balance");
  const usdDisplay = document.getElementById("usdValue");
  const popup = document.getElementById("popup");
  const balanceSection = document.getElementById("balanceSection");
  const actionSection = document.getElementById("actionSection");

  const CONTRACT_ADDRESS = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237";
  const CONTRACT_ABI = [
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
  ];

  function showPopup(message) {
    popup.textContent = message;
    popup.classList.remove("hidden");
    setTimeout(() => popup.classList.add("hidden"), 3000);
  }

  async function connectWallet() {
    let web3;
    let account;

    try {
      if (window.ethereum) {
        // MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
      } else {
        // Fallback to WalletConnect
        const provider = new WalletConnectProvider({
          rpc: {
            97: "https://data-seed-prebsc-1-s1.binance.org:8545"
          }
        });
        await provider.enable();
        web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
      }

      if (!account) {
        showPopup("Wallet connection failed");
        return;
      }

      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const balanceRaw = await contract.methods.balanceOf(account).call();
      const tiffy = web3.utils.fromWei(balanceRaw, "ether");
      const tiffyRounded = parseFloat(tiffy).toFixed(2);

      const short = `${account.slice(0, 6)}...${account.slice(-4)}`;
      walletStatus.textContent = `Connected: ${short}`;
      balanceDisplay.textContent = tiffyRounded;
      usdDisplay.textContent = `$${(parseFloat(tiffyRounded) * 12).toFixed(2)}`;

      balanceSection.classList.remove("hidden");
      actionSection.classList.remove("hidden");

      showPopup("Wallet connected!");

    } catch (err) {
      console.error(err);
      showPopup("Error: " + err.message);
    }
  }

  connectBtn.addEventListener("click", connectWallet);
</script>
