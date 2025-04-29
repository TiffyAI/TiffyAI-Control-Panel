if (window.ethereum) {
  window.ethereum.on("disconnect", () => {
    showPopup("Wallet disconnected!");
    setTimeout(() => {
      location.reload();
    }, 1500);
  });
}