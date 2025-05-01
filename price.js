window.addEventListener("DOMContentLoaded", () => {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
  const pairAddress = "0xa35641960651874F6b42f2ba4F77f717BA823229";
  const TIFFYAI = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237";

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
      payable: false,
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

  const pairContract = new web3.eth.Contract(pairABI, pairAddress);

  async function getBNBPriceUSD() {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const data = await res.json();
      return data.binancecoin.usd;
    } catch (e) {
      console.error("Failed to fetch BNB price", e);
      return 0;
    }
  }

  async function updateTiffyPrice() {
    try {
      const reserves = await pairContract.methods.getReserves().call();
      const token0 = await pairContract.methods.token0().call();
      const token1 = await pairContract.methods.token1().call();

      const reserve0 = web3.utils.fromWei(reserves._reserve0.toString());
      const reserve1 = web3.utils.fromWei(reserves._reserve1.toString());

      let priceInBNB = token0.toLowerCase() === TIFFYAI.toLowerCase()
        ? parseFloat(reserve1) / parseFloat(reserve0)
        : parseFloat(reserve0) / parseFloat(reserve1);

      const bnbPriceUSD = await getBNBPriceUSD();
      const priceUSD = priceInBNB * bnbPriceUSD;

      document.getElementById("usdValue").textContent = `$${priceUSD.toFixed(6)} USD`;
    } catch (err) {
      console.error("Error updating TiffyAI price:", err);
      document.getElementById("usdValue").textContent = "Unavailable";
    }
  }

  updateTiffyPrice();
  setInterval(updateTiffyPrice, 15000);
});
