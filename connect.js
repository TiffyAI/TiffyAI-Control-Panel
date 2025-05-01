document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");
  const walletStatus = document.getElementById("walletStatus");
  const balanceSection = document.getElementById("balanceSection");
  const actionSection = document.getElementById("actionSection");
  const popup = document.getElementById("popup");

  async function showPopup(message) {
    popup.innerText = message;
    popup.classList.remove("hidden");
    popup.classList.add("visible");
    setTimeout(() => {
      popup.classList.remove("visible");
      popup.classList.add("hidden");
    }, 3000);
  }

  async function connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const userWallet = accounts[0];

        walletStatus.textContent = "Wallet Connected";
        balanceSection.classList.remove("hidden");
        actionSection.classList.remove("hidden");

        // Fade out and hide the button
        connectButton.style.transition = "opacity 0.6s ease-in-out";
        connectButton.style.opacity = "0";
        setTimeout(() => {
          connectButton.style.display = "none";
        }, 600);

        showPopup("Connected to wallet: " + userWallet.slice(0, 6) + "...");
      } else {
        showPopup("No wallet found. Trying other providers...");
        window.open("https://metamask.app.link/dapp/tiffyai.github.io/TiffyAI-Control-Panel", "_blank");
      }
    } catch (error) {
      console.error(error);
      showPopup("Connection failed.");
    }
  }

  connectButton.addEventListener("click", connectWallet);
});
