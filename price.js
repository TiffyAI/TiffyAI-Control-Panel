const Web3 = require("web3");
const fetch = require("node-fetch");

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");

// Your official TiffyAI/WBNB pair
const pairAddress = "0xa35641960651874F6b42f2ba4F77f717BA823229";

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
  }
];

const pair = new web3.eth.Contract(pairABI, pairAddress);

// TiffyAI token address
const TIFFYAI = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237";

async function getBNBPriceUSD() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
  );
  const data = await res.json();
  return data.binancecoin.usd;
}

async function getTiffyPriceUSD() {
  try {
    const reserves = await pair.methods.getReserves().call();
    const token0 = await pair.methods.token0().call();
    const token1 = await pair.methods.token1().call();

    const reserve0 = web3.utils.fromWei(reserves._reserve0.toString());
    const reserve1 = web3.utils.fromWei(reserves._reserve1.toString());

    let priceInBNB;

    if (token0.toLowerCase() === TIFFYAI.toLowerCase()) {
      priceInBNB = parseFloat(reserve1) / parseFloat(reserve0);
    } else {
      priceInBNB = parseFloat(reserve0) / parseFloat(reserve1);
    }

    const bnbUSD = await getBNBPriceUSD();
    const priceInUSD = priceInBNB * bnbUSD;

    console.log(`TiffyAI Price: $${priceInUSD.toFixed(6)} USD`);
    return priceInUSD;
  } catch (err) {
    console.error("Error fetching Tiffy price:", err);
    return null;
  }
}

// Run once for test
getTiffyPriceUSD();
