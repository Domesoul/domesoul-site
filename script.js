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
