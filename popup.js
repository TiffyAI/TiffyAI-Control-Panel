function showPopup(message, duration = 3000) {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  popup.classList.remove("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
  }, duration);
}

function showLoading(message = "Loading...") {
  const loading = document.getElementById("loading");
  loading.innerText = message;
  loading.classList.remove("hidden");
}

function hideLoading() {
  const loading = document.getElementById("loading");
  loading.classList.add("hidden");
}