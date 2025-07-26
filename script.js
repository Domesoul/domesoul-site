console.log('Domé Soul site loaded');
const toggleBtn = document.querySelector('.toggle-button');
const navLinks = document.querySelector('.nav-links');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
<script>
  const quotes = document.querySelectorAll('.quote');
  let current = 0;
  setInterval(() => {
    quotes[current].classList.remove('active');
    current = (current + 1) % quotes.length;
    quotes[current].classList.add('active');
  }, 5000); // switch every 5 seconds
</script>
// Testimonial Carousel Script
const testimonials = document.querySelectorAll('.testimonial');
let tIndex = 0;
setInterval(() => {
  testimonials[tIndex].classList.remove('active');
  tIndex = (tIndex + 1) % testimonials.length;
  testimonials[tIndex].classList.add('active');
}, 6000);
