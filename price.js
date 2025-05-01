async function fetchLivePrice() {
  try {
    const response = await fetch("https://api.dexscreener.com/latest/dex/pairs/bsc/0x9F8Ed638f4Ddf65e18f3A3222f5275392329D07F");
    const data = await response.json();
    const price = data?.pair?.priceUsd;

    if (price) {
      document.getElementById("usdValue").innerText = `$${parseFloat(price).toFixed(6)} USD`;
    } else {
      document.getElementById("usdValue").innerText = "Unavailable";
    }
  } catch (err) {
    console.error("Error fetching Tiffy price:", err);
    document.getElementById("usdValue").innerText = "Unavailable";
  }
}

setInterval(fetchLivePrice, 15000);
fetchLivePrice();
