/* script.js */
(function() {
  const endDate = new Date('2025-08-25T00:00:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  function updateTimer() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;
    daysEl.textContent = String(Math.floor(diff / (1000*60*60*24))).padStart(2,'0');
    hoursEl.textContent = String(Math.floor(diff / (1000*60*60) % 24)).padStart(2,'0');
    minsEl.textContent = String(Math.floor(diff / (1000*60) % 60)).padStart(2,'0');
    secsEl.textContent = String(Math.floor(diff / 1000 % 60)).padStart(2,'0');
  }
  setInterval(updateTimer, 1000);

  const quotes = document.querySelectorAll('.quote');
  let current = 0;
  function rotateQuotes() {
    quotes[current].classList.remove('active');
    current = (current+1) % quotes.length;
    quotes[current].classList.add('active');
  }
  quotes[0].classList.add('active');
  setInterval(rotateQuotes, 5000);
})();
// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
});
