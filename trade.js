const startAI = document.getElementById("startAI");
const stopAI = document.getElementById("stopAI");
const manualBuy = document.getElementById("manualBuy");
const manualSell = document.getElementById("manualSell");
const tradeLog = document.getElementById("tradeLog");

const SERVER_URL = "https://tiffyai-cloud.onrender.com"; // Your backend

function logTrade(message) {
  const timestamp = new Date().toLocaleTimeString();
  tradeLog.textContent = `[${timestamp}] ${message}\n` + tradeLog.textContent;
}

startAI.addEventListener("click", async () => {
  showLoading("Activating AI Trader...");
  try {
    const res = await fetch(`${SERVER_URL}/start-ai`, { method: "POST" });
    const data = await res.text();

    logTrade("AI Trader Activated");
    showPopup("AI Trader Activated!");
  } catch (err) {
    logTrade("AI Start Error: " + err.message);
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

    logTrade("AI Trader Stopped");
    showPopup("AI Trader Stopped.");
  } catch (err) {
    logTrade("AI Stop Error: " + err.message);
    showPopup("Error stopping AI.");
  } finally {
    hideLoading();
  }
});

manualBuy.addEventListener("click", async () => {
  showLoading("Buying TIFFY...");
  try {
    const res = await fetch(`${SERVER_URL}/manual-buy`, { method: "POST" });
    const result = await res.json();

    if (result?.txHash) {
      logTrade("Manual Buy TX: " + result.txHash);
      showPopup("Manual Buy Successful!");
    } else {
      logTrade("Manual Buy Failed: " + result.message);
      showPopup("Buy failed.");
    }
  } catch (err) {
    logTrade("Manual Buy Error: " + err.message);
    showPopup("Error during Buy.");
  } finally {
    hideLoading();
  }
});

manualSell.addEventListener("click", async () => {
  showLoading("Selling TIFFY...");
  try {
    const res = await fetch(`${SERVER_URL}/manual-sell`, { method: "POST" });
    const result = await res.json();

    if (result?.txHash) {
      logTrade("Manual Sell TX: " + result.txHash);
      showPopup("Manual Sell Successful!");
    } else {
      logTrade("Manual Sell Failed: " + result.message);
      showPopup("Sell failed.");
    }
  } catch (err) {
    logTrade("Manual Sell Error: " + err.message);
    showPopup("Error during Sell.");
  } finally {
    hideLoading();
  }
});
