const SERVER_URL = "https://tiffyai-cloud.onrender.com";
const startAI = document.getElementById("startAI");
const stopAI = document.getElementById("stopAI");

async function checkWalletConnection() {
  if (typeof window.ethereum === "undefined") {
    showPopup("MetaMask not found!");
    throw new Error("No Ethereum provider found");
  }

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const chainId = await ethereum.request({ method: "eth_chainId" });

  console.log("Connected account:", accounts[0]);
  console.log("Chain ID:", chainId);

  if (chainId !== "0x38") {
    showPopup("Please switch to BSC Mainnet");
    throw new Error("Wrong network");
  }

  return accounts[0];
}

async function sendTradeRequest(endpoint) {
  showLoading("Sending trade request...");
  try {
    const account = await checkWalletConnection();
    const res = await fetch(`${SERVER_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: account })
    });

    const responseText = await res.text();
    console.log(`[Trade Response] ${endpoint}:`, responseText);

    if (res.ok) {
      showPopup(`Trade ${endpoint === 'manual-buy' ? "Buy" : "Sell"} executed!`);
    } else {
      showPopup("Trade failed: " + responseText);
    }
  } catch (err) {
    console.error("Trade error:", err);
    showPopup("Error: " + err.message);
  } finally {
    hideLoading();
  }
}

startAI.addEventListener("click", async () => {
  showLoading("Activating AI Trader...");
  try {
    const res = await fetch(`${SERVER_URL}/start-ai`, { method: "POST" });
    const data = await res.text();
    console.log("AI start:", data);
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
    const data = await res.text();
    console.log("AI stop:", data);
    showPopup("AI Trader Stopped.");
  } catch (err) {
    console.error("Stop AI error:", err);
    showPopup("Error stopping AI.");
  } finally {
    hideLoading();
  }
});

// Optional: Manual buy/sell buttons
document.getElementById("manualBuy")?.addEventListener("click", () => sendTradeRequest("manual-buy"));
document.getElementById("manualSell")?.addEventListener("click", () => sendTradeRequest("manual-sell"));
