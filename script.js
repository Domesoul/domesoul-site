
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
