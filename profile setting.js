function showEditModal() {
    var modal = document.getElementById('editModal');
    modal.style.display = 'flex';
  }
  
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
  }
  
  function updateText() {
    var newText = document.getElementById('editText').value;
    document.getElementById('profileName').innerText = newText;
    closeEditModal();
  }
  
  function editText() {
    showEditModal();
    var currentText = document.getElementById('profileName').innerText;
    document.getElementById('editText').value = currentText;
  }
  
  window.onclick = function(event) {
    var modal = document.getElementById('editModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
  
  document.getElementById('editModal').style.display = 'none';