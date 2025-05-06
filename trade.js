const startAI = document.getElementById("startAI");
const stopAI = document.getElementById("stopAI");

// New Manual Trade Buttons
const buyButton = document.createElement("button");
buyButton.textContent = "Buy TIFFY";
const sellButton = document.createElement("button");
sellButton.textContent = "Sell TIFFY";
document.getElementById("actionSection").appendChild(buyButton);
document.getElementById("actionSection").appendChild(sellButton);

const SERVER_URL = "https://tiffyai-cloud.onrender.com"; // Update if needed
const TIFFY_ADDRESS = "0x6df97Ec32401e23dEDB2E6cAF3035155890DC237";
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Mainnet WBNB

const slippage = 0.01; // 1%

startAI.addEventListener("click", async () => {
  showLoading("Activating AI Trader...");
  try {
    const res = await fetch(`${SERVER_URL}/start-ai`, { method: "POST" });
    showPopup("AI Trader Activated!");
  } catch (err) {
    console.error("Start AI error:", err);
    showPopup("Error activating AI.");
  } finally {
    hideLoading();
  }
});

stopAI.addEventListener("click", async () => {
  showLoading("Stopping AI Trader...");
  try {
    const res = await fetch(`${SERVER_URL}/stop-ai`, { method: "POST" });
    showPopup("AI Trader Stopped.");
  } catch (err) {
    console.error("Stop AI error:", err);
    showPopup("Error stopping AI.");
  } finally {
    hideLoading();
  }
});

buyButton.addEventListener("click", () => {
  initiateTrade("buy");
});

sellButton.addEventListener("click", () => {
  initiateTrade("sell");
});

async function initiateTrade(type) {
  if (typeof window.ethereum === "undefined") {
    return showPopup("Please install MetaMask");
  }

  const web3 = new Web3(window.ethereum);
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  const router = new web3.eth.Contract([
    {
      "name": "swapExactETHForTokens",
      "type": "function",
      "inputs": [
        { "name": "amountOutMin", "type": "uint256" },
        { "name": "path", "type": "address[]" },
        { "name": "to", "type": "address" },
        { "name": "deadline", "type": "uint256" }
      ],
      "outputs": [{ "type": "uint256[]" }],
      "stateMutability": "payable"
    },
    {
      "name": "swapExactTokensForETH",
      "type": "function",
      "inputs": [
        { "name": "amountIn", "type": "uint256" },
        { "name": "amountOutMin", "type": "uint256" },
        { "name": "path", "type": "address[]" },
        { "name": "to", "type": "address" },
        { "name": "deadline", "type": "uint256" }
      ],
      "outputs": [{ "type": "uint256[]" }],
      "stateMutability": "nonpayable"
    }
  ], PANCAKE_ROUTER);

  const amount = web3.utils.toWei("0.01"); // Fixed amount for now

  if (type === "buy") {
    showLoading("Swapping BNB for TIFFY...");
    try {
      const tx = await router.methods.swapExactETHForTokens(
        0,
        [WBNB_ADDRESS, TIFFY_ADDRESS],
        account,
        Math.floor(Date.now() / 1000) + 60 * 2
      ).send({ from: account, value: amount });

      showPopup(`Trade success! Tx: ${tx.transactionHash}`);
    } catch (err) {
      console.error(err);
      showPopup("Trade failed. Check console for details.");
    } finally {
      hideLoading();
    }
  }

  if (type === "sell") {
    showLoading("Swapping TIFFY for BNB...");

    try {
      // Approve TIFFY if needed
      const token = new web3.eth.Contract([
        { "name": "approve", "type": "function", "inputs": [
          { "name": "spender", "type": "address" },
          { "name": "amount", "type": "uint256" }
        ], "outputs": [{ "type": "bool" }] }
      ], TIFFY_ADDRESS);

      await token.methods.approve(PANCAKE_ROUTER, amount).send({ from: account });

      const tx = await router.methods.swapExactTokensForETH(
        amount,
        0,
        [TIFFY_ADDRESS, WBNB_ADDRESS],
        account,
        Math.floor(Date.now() / 1000) + 60 * 2
      ).send({ from: account });

      showPopup(`Trade success! Tx: ${tx.transactionHash}`);
    } catch (err) {
      console.error(err);
      showPopup("Sell failed. See console.");
    } finally {
      hideLoading();
    }
  }
}
