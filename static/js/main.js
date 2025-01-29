let currentStation = '';
// meal (Breakfast, Lunch, Dinner)
let currentMeal = '';

// load existing files when modal opens
function openUploadModal(station, meal) {
    currentStation = station;
    currentMeal = meal;
    
    document.getElementById('uploadTitle').textContent = `${station} (${meal})`;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('uploadModal').style.display = 'block';
    
    // load existing files
    loadExistingFiles();
}

function openBugModal() { 
    document.getElementById('report-bug-modal').style.display = 'block'; 
    document.getElementById('overlay').style.display = 'block';
}

function closeBugModal(){ 
    document.getElementById('report-bug-modal').style.display = 'none'; 
    document.getElementById('overlay').style.display = 'none';
}

// add toast message 
function sendMessage(){ 
    document.getElementById('report-bug-modal').style.display = 'none'; 
    document.getElementById('overlay').style.display = 'none';
}
 
function loadExistingFiles() {
    // get files from specfied folder 
    fetch(`/files/${currentStation}/${currentMeal}`)
        .then(response => response.json())
        .then(data => {
            const uploadsList = document.getElementById('uploads-list');
            // update uploads list to be empty 
            uploadsList.innerHTML = '';
            
            // if still no file
            if (!data.files || data.files.length === 0) {
                const emptyState = document.createElement('li');
                emptyState.className = 'empty-state';
                emptyState.textContent = 'No files uploaded yet';
                uploadsList.appendChild(emptyState);
                return;
            }
            
            // file info and file buttons
                // for each file
            data.files.forEach(file => {
                const li = document.createElement('li');
                li.className = 'file-item';
                
                const fileInfo = document.createElement('span');
                fileInfo.textContent = file;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.className = 'delete-file-btn';
                deleteBtn.onclick = () => deleteFile(file);
                
                // 
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'View';
                viewBtn.className = 'view-file-btn';
                viewBtn.onclick = () => viewFile(file);
                
                li.appendChild(fileInfo);
                li.appendChild(viewBtn);
                li.appendChild(deleteBtn);
                uploadsList.appendChild(li);
            });
        })
        
        // catch error if theres an error uploading the file
        // errors from server related tuff can go here to
        // mostly just syntax right now
        .catch(error => {
            console.error('Error loading files:', error);
            const uploadsList = document.getElementById('uploads-list');
            uploadsList.innerHTML = '';
            const errorState = document.createElement('li');
            errorState.className = 'empty-state error';
            errorState.textContent = 'Error loading files';
            uploadsList.appendChild(errorState);
        });
}


// close modal 
function closeUploadModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('selectedFileName').textContent = 'No file selected';
    document.getElementById('fileInput').value = '';
}


function triggerFileInput() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'No file selected';
    document.getElementById('selectedFileName').textContent = fileName;
});


function alertModal(type, msg) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alert('Error: Modal not found');
        return;
    }

    alertContainer.style.display = 'block';
    const alertMessageType = document.getElementById('alert-type'); 
    const messageElement = document.getElementById('alert-message');

    if (!messageElement) {
        alert('Message element not found');
        return;
    }
    messageElement.textContent = msg;
    alertMessageType.textContent = type; 

    setTimeout(() => {
        alertContainer.style.display = 'none'; 
    }, 1800); 
}

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alertModal('Please select a file', ''); 
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('station', currentStation);
    formData.append('meal', currentMeal);
    
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const upload_message = "uploaded new file";
        const alertType = "Successfully"; 
        alertModal(alertType, upload_message);
        loadExistingFiles(); // Refresh the file list
        fileInput.value = ''; // Clear the file input
        document.getElementById('selectedFileName').textContent = 'No file selected';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error uploading file');
    });
}

function deleteFile(filename) {
    // are you shure you want to delete this file
    // hide upload modal and dispaly delete modal
    // prompt user
    // hide delete modal and disaply updated upload modal
    const deleteContainer = document.getElementById('delete-container'); 
    const yButton = document.getElementById('yes-delete'); 
    const nButton = document.getElementById('no-delete'); 
    const uploadModal = document.getElementById('uploadModal');

    uploadModal.style.display = 'none'; 
    deleteContainer.style.display = 'block'; 
    
    yButton.addEventListener('click', function(){ 
        deleteContainer.style.display = 'none'; 
        uploadModal.style.display = 'block'; 

        fetch(`/delete/${currentStation}/${currentMeal}/${filename}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {        
            alertModal(filename, 'Deleted' ); 
            loadExistingFiles(); // Refresh the file list
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting file');
        });
    }); 

    nButton.addEventListener('click', function(){
        deleteContainer.style.display = 'none'; 
        uploadModal.style.display = 'block'; 
    })
}

function report(){ 
    const reportBtn = document.getElementById('report'); 
    const reportArea = document.getElementById('report-container'); 
    
    reportBtn.addEventListener('click', function(){ 
        reportArea.style.display = 'block'; 
    }); 
}

function viewFile(filename) {
    window.open(`/uploads/${currentStation}/${currentMeal}/${filename}`, '_blank');
}


