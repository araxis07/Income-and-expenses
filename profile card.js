
function showEditModal() {
    document.getElementById('editModal').style.display = 'block';
}


function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}


function updateText() {
    var newText = document.getElementById('editText').value;
    document.getElementById('editableText').innerText = newText;
    closeEditModal();
}


function editText() {
    showEditModal();
    var currentText = document.getElementById('editableText').innerText;
    document.getElementById('editText').value = currentText;
}
