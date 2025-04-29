const balanceElement = document.getElementById("balance");
const usdValueElement = document.getElementById("usdValue");

// Simulated price source for now (replace with real oracle or API fetch later)
let tiffyPriceUSD = 12.00; // Temporary fixed test value

async function getBalance(account) {
  try {
    // Simulate 2.00 TIFFY testnet balance (replace with real Web3 call)
    const balance = 2.00;

    balanceElement.innerText = balance.toFixed(2);

    const usdValue = balance * tiffyPriceUSD;
    usdValueElement.innerText = usdValue.toFixed(2);

  } catch (error) {
    console.error("Error fetching balance:", error);
    showPopup("Error fetching balance.");
  }
}