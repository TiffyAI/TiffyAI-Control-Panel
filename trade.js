const startAI = document.getElementById("startAI");
const stopAI = document.getElementById("stopAI");

// Testnet server endpoint (update if needed)
const SERVER_URL = "https://tiffyai-cloud.onrender.com"; // Or your deployed backend

startAI.addEventListener("click", async () => {
  showLoading("Activating AI Trader...");
  try {
    const res = await fetch(`${SERVER_URL}/start-ai`, { method: "POST" });
    const data = await res.text();

    showPopup("AI Trader Activated!");
    console.log("AI start:", data);
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

    showPopup("AI Trader Stopped.");
    console.log("AI stop:", data);
  } catch (err) {
    console.error("Stop AI error:", err);
    showPopup("Error stopping AI.");
  } finally {
    hideLoading();
  }
});