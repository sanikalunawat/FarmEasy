document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("update-profile-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Ask for confirmation
        var confirmed = window.confirm('DO YOU WANT TO UPDATE YOUR PROFILE?');
        
        // If confirmed, redirect to the profile page
        if (confirmed) {
            window.location.href = './profile.html';
        }
    });

    var fileInput = document.getElementById('image');
    var file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.alt = 'Uploaded Image';

        var profilePictureDiv = document.getElementById('profile-picture');
        profilePictureDiv.innerHTML = '';
        profilePictureDiv.appendChild(imgElement);
    }; // Added closing curly brace for the onload function
}); // Added closing curly brace for the DOMContentLoaded event listener
