function showPopup(message, duration = 4000) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.remove("hidden");
  popup.classList.add("visible");

  setTimeout(() => {
    popup.classList.remove("visible");
    popup.classList.add("hidden");
  }, duration);
}
