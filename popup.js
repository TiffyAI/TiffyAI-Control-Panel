function showPopup(message, duration = 4000) {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.textContent = message;
  popup.classList.add("visible");
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.remove("visible");
    popup.classList.add("hidden");
  }, duration);
}
