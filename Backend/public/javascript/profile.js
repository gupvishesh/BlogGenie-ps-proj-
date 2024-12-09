let darkMode = false;

// Remove hardcoded profileData

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    updateDarkModeIcon();
}

function updateDarkModeIcon() {
    const icon = document.querySelector('#dark-mode-toggle i');
    icon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
}

// Remove loadProfileData function as we don't need it anymore - data comes from EJS template

// Remove the loadBlogPosts function and its invocation

document.getElementById('home-btn').addEventListener('click', function() {
    window.location.href = '/blogGenie';
});

document.getElementById('new-blog-btn').addEventListener('click', function() {
    localStorage.removeItem('currentEditPost');
    window.location.href = '/blogGenie/new';
});

document.getElementById('published-blogs-btn').addEventListener('click', function() {
    window.location.href = '/blogGenie/view';
});
document.getElementById('chatbot-btn').addEventListener('click', function() {
    window.location.href = '/blogGenie/chatbot';
});

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

document.getElementById('blog-grid').addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        e.stopPropagation();
        const postId = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`/blogGenie/blogs/${postId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadBlogPosts();
            }
        } catch (error) {
            console.error('Error deleting blog post:', error);
        }
    }
});

document.querySelector('.profile-picture-container').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result;
            profileData.profilePicture = e.target.result;
            localStorage.setItem('profileData', JSON.stringify(profileData));
        };
        reader.readAsDataURL(file);
    }
});

// Initialize
darkMode = localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark-mode', darkMode);
updateDarkModeIcon();
// Remove loadBlogPosts(); from here