// script.js for Domé Soul site

// Countdown Timer
(function() {
  const endDate = new Date('2025-08-25T00:00:00').getTime();
  const timerEl = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function updateTimer() {
    const now = Date.now();
    const diff = endDate - now;
    if (diff <= 0) return;

    timerEl.days.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    timerEl.hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    timerEl.minutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    timerEl.seconds.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

// Quotes Slider
(function() {
  const quotes = document.querySelectorAll('.quote');
  let current = 0;

  function rotateQuotes() {
    quotes[current].classList.remove('active');
    current = (current + 1) % quotes.length;
    quotes[current].classList.add('active');
  }

  rotateQuotes();
  setInterval(rotateQuotes, 5000);
})();

// Mobile Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
});
document.addEventListener('DOMContentLoaded', () => {
  new Splide('#hero-carousel', {
    type: 'loop',
    perPage: 1,
    autoplay: true,
    interval: 4000,
    pagination: true,
    arrows: false,
  }).mount();
});


