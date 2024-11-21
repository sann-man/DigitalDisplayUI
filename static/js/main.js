let currentStation = ''; 
let currentMeal = '';

// open the overlay (called when button is clicked)
function openUploadModal(station, meal) {
    // vars
    currentStation = station;
    currentMeal = meal;


    document.getElementById('uploadTitle').textContent = ` ${station} (${meal})`;
    // change from disaply:none; to display: block; 
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('uploadModal').style.display = 'block';
}

// resesttting the openoverlay function to go back to original view
function closeUploadModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('selectedFileName').textContent = 'No file selected';
    document.getElementById('fileInput').value = '';
}

// called when choose file button is clicked
function triggerFileInput() {
    document.getElementById('fileInput').click();
}

// called when file is selected
// prevent error if no file is selected
document.getElementById('fileInput').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'No file selected';
    document.getElementById('selectedFileName').textContent = fileName;
});

// gets selected file and checks if file was actually selected
// FormData is used to send files with AJAX (need to review)
// Makes a POST request to the '/upload' endpoint with the file data
// Uses the Fetch API to make the request
// Handles the response:
    // If successful, shows success message and closes the modal
    // If there's an error, logs it to console and shows error message

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('station', currentStation);
    formData.append('meal', currentMeal);

    // replace with actual upload endpoint in the fututre 
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('File uploaded successfully!');
        closeUploadModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading file');
    });
}