//show the edit modal
function changeProfilePicture(input) {
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function showEditModal() {
    var modal = document.getElementById('editModal');
    modal.style.display = 'flex'; // Set display to flex
    modal.style.top = window.innerHeight / 2 - modal.offsetHeight / 2 + 'px'; // Center vertically
    modal.style.left = window.innerWidth / 2 - modal.offsetWidth / 2 + 'px'; // Center horizontally
}

//close the edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

//update the text
function updateText() {
    var newText = document.getElementById('editText').value;
    document.getElementById('profileName').innerText = newText;
    closeEditModal();
}

//make the text editable on click
function editText() {
    showEditModal();
    var currentText = document.getElementById('profileName').innerText;
    document.getElementById('editText').value = currentText;
}

// Close the modal if clicked outside the content
window.onclick = function(event) {
    var modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Initialize the modal to be hidden
document.getElementById('editModal').style.display = 'none';




