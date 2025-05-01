window.addEventListener('load', async () => {
  const usdValueElement = document.getElementById("usdValue");
  const pairAddress = "0x9F8Ed638f4Ddf65e18f3A3222f5275392329D07F"; // Old verified pair

  async function fetchPrice() {
    try {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${pairAddress}`);
      const data = await res.json();
      const price = data?.pair?.priceUsd;

      if (price) {
        usdValueElement.textContent = `$${parseFloat(price).toFixed(6)} USD`;
      } else {
        usdValueElement.textContent = "Unavailable";
      }
    } catch (err) {
      console.error("Error fetching USD price:", err);
      usdValueElement.textContent = "Unavailable";
    }
  }

  fetchPrice();
  setInterval(fetchPrice, 15000); // Update every 15 seconds
});
