window.addEventListener("load", async () => {
  if (typeof window.ethereum === "undefined") {
    console.warn("No wallet detected.");
    return;
  }

  const web3 = new Web3(window.ethereum);
  const pairAddress = "0xDc7Fe4471eCD20d0af908A0952BA726131381099";
  const tiffyAddress = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237";

  const pairABI = [
    {
      constant: true,
      inputs: [],
      name: "getReserves",
      outputs: [
        { internalType: "uint112", name: "_reserve0", type: "uint112" },
        { internalType: "uint112", name: "_reserve1", type: "uint112" },
        { internalType: "uint32", name: "_blockTimestampLast", type: "uint32" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "token0",
      outputs: [{ name: "", type: "address" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "token1",
      outputs: [{ name: "", type: "address" }],
      type: "function",
    },
  ];

  const tokenABI = [
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

  const pair = new web3.eth.Contract(pairABI, pairAddress);
  const token = new web3.eth.Contract(tokenABI, tiffyAddress);

  async function getBNBPriceUSD() {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const data = await res.json();
      return data?.binancecoin?.usd || 0;
    } catch (err) {
      console.error("Error fetching BNB price:", err);
      return 0;
    }
  }

  async function getTiffyPriceUSD() {
    try {
      const reserves = await pair.methods.getReserves().call();
      const token0 = await pair.methods.token0().call();
      const token1 = await pair.methods.token1().call();

      const reserve0 = web3.utils.fromWei(reserves._reserve0.toString());
      const reserve1 = web3.utils.fromWei(reserves._reserve1.toString());

      let priceInBNB = 0;

      if (token0.toLowerCase() === tiffyAddress.toLowerCase()) {
        priceInBNB = parseFloat(reserve1) / parseFloat(reserve0);
      } else {
        priceInBNB = parseFloat(reserve0) / parseFloat(reserve1);
      }

      const bnbUSD = await getBNBPriceUSD();
      return priceInBNB * bnbUSD;
    } catch (err) {
      console.error("Error fetching Tiffy price:", err);
      return 0;
    }
  }

  async function updateBalanceAndPrice() {
    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        document.getElementById("balance").textContent = "--";
        document.getElementById("usdValue").textContent = "Unavailable";
        return;
      }

      const user = accounts[0];
      const balanceRaw = await token.methods.balanceOf(user).call();
      const decimals = await token.methods.decimals().call();
      const balance = (balanceRaw / 10 ** decimals).toFixed(4);
      document.getElementById("balance").textContent = balance;

      const priceUSD = await getTiffyPriceUSD();
      const usdValue = (parseFloat(balance) * priceUSD).toFixed(2);
      document.getElementById("usdValue").textContent = `${usdValue} USD`;
    } catch (err) {
      console.error("Balance/Price update error:", err);
      document.getElementById("balance").textContent = "--";
      document.getElementById("usdValue").textContent = "Unavailable";
    }
  }

  ethereum.on("accountsChanged", updateBalanceAndPrice);
  ethereum.on("chainChanged", () => location.reload());

  updateBalanceAndPrice();
  setInterval(updateBalanceAndPrice, 15000);
});
