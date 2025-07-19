// Hero Slider
let heroIndex = 0;
function rotateHero() {
  const slides = document.querySelectorAll('.hero-slide');
  slides.forEach(s => s.classList.remove('active'));
  heroIndex = (heroIndex + 1) % slides.length;
  slides[heroIndex].classList.add('active');
  setTimeout(rotateHero, 5000);
}
rotateHero();

// Quote Carousel
let quoteIndex = 0;
function rotateQuote() {
  const quotes = document.querySelectorAll('.quote');
  quotes.forEach(q => q.classList.remove('active'));
  quoteIndex = (quoteIndex + 1) % quotes.length;
  quotes[quoteIndex].classList.add('active');
  setTimeout(rotateQuote, 7000);
}
rotateQuote();

// Navigation Toggle for Mobile
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}
