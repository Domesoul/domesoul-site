
function openModal(songId) {
  document.getElementById('modal-' + songId).style.display = "block";
}
function closeModal(songId) {
  document.getElementById('modal-' + songId).style.display = "none";
}
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

// Countdown Timer
document.addEventListener("DOMContentLoaded", function () {
  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2025-08-01T00:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownElement.textContent = "Release Day!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownElement.textContent = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  setInterval(updateCountdown, 1000);
});
