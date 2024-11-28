let darkMode = false;
let profileData = {
    username: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-25%20141616-6em4aqT79EaXRGiKwv8FHhB6TZX8JE.png'
};

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

function loadProfileData() {
    const storedProfileData = localStorage.getItem('profileData');
    if (storedProfileData) {
        profileData = JSON.parse(storedProfileData);
        document.getElementById('username').textContent = profileData.username;
        document.getElementById('email').textContent = profileData.email;
        document.getElementById('profile-picture').src = profileData.profilePicture;
    }
}

function loadBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';
    
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
        const blogPosts = JSON.parse(storedPosts);
        blogPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            postElement.style.backgroundImage = `url('${post.image}')`;
            postElement.innerHTML = `
                <h3>${post.heading}</h3>
                <p>${post.content.substring(0, 100)}...</p>
                <small>${post.date}</small>
                <button class="delete-btn" data-id="${post.id}">&times;</button>
            `;
            blogGrid.appendChild(postElement);
        });
    }
}

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

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

document.getElementById('blog-grid').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const postId = parseInt(e.target.getAttribute('data-id'));
        let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        blogPosts = blogPosts.filter(post => post.id !== postId);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        loadBlogPosts();
    } else if (e.target.closest('.blog-card')) {
        const postId = parseInt(e.target.closest('.blog-card').querySelector('.delete-btn').getAttribute('data-id'));
        let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const selectedPost = blogPosts.find(post => post.id === postId);
        if (selectedPost) {
            localStorage.setItem('currentEditPost', JSON.stringify(selectedPost));
            window.location.href = 'blog-editor.html';
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
loadProfileData();
loadBlogPosts();