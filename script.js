console.log('Domé Soul site loaded');
const toggleBtn = document.querySelector('.toggle-button');
const navLinks = document.querySelector('.nav-links');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
