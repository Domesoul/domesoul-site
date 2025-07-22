
// Countdown Timer for Domé Soul

document.addEventListener("DOMContentLoaded", function () {
  const countdown = document.getElementById("countdown");

  // Set the release date here
  const releaseDate = new Date("August 10, 2025 00:00:00").getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = releaseDate - now;

    if (distance < 0) {
      clearInterval(timer);
      countdown.innerHTML = "<p>The new single is out now!</p>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `
      <div style="font-size: 1.5em;">
        <strong>${days}</strong>d :
        <strong>${hours}</strong>h :
        <strong>${minutes}</strong>m :
        <strong>${seconds}</strong>s
      </div>
    `;
  }, 1000);
});
