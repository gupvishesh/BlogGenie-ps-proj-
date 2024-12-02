let publishedDate = null;
    // let profileData = {
    //     username: "JohnDoe",
    //     email: "johndoe@example.com",
    //     profilePicture: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-25%20141616-KngqCB5CgBGQIbUN3nj8joYdWEMT36.png"
    // };
    let currentEditPost = null;

    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        }).replace(',', '');
        const category = document.getElementById('category-dropdown').value;
        document.getElementById('current-date-time').textContent = `${dateTimeString} ${category ? '| ' + category : ''}`;
    }

    function loadProfileData() {
        const storedProfileData = localStorage.getItem('profileData');
        if (storedProfileData) {
            profileData = JSON.parse(storedProfileData);
            document.getElementById('profile-username').textContent = profileData.username;
            document.getElementById('profile-email').textContent = profileData.email;
            document.getElementById('profile-picture').src  = profileData.profilePicture;
        }
    }

    function loadCurrentEditPost() {
        const storedPost = localStorage.getItem('currentEditPost');
        if (storedPost) {
            currentEditPost = JSON.parse(storedPost);
            document.getElementById('blog-heading').value = currentEditPost.heading;
            document.getElementById('blog-content').value = currentEditPost.content;
            document.getElementById('category-dropdown').value = currentEditPost.category || '';
            if (currentEditPost.image) {
                document.getElementById('image-preview').src = currentEditPost.image;
                document.getElementById('image-preview').style.display = 'block';
            }
            publishedDate = currentEditPost.date;
            updateDateTime();
        }
    }

    document.getElementById('blog-heading').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('blog-content').focus();
        }
    });

    document.getElementById('profile-btn').addEventListener('click', function() {
        const profileBox = document.getElementById('profile-box');
        profileBox.style.display = profileBox.style.display === 'none' ? 'flex' : 'none';
    });

    document.getElementById('my-blogs-btn').addEventListener('click', function() {
        window.location.href = '/blogGenie/profile';
    });

    document.getElementById('update-btn').addEventListener('click', function() {
        const blogContent = document.getElementById('blog-content');
        blogContent.focus();
        blogContent.setSelectionRange(blogContent.value.length, blogContent.value.length);
        document.getElementById('delete-image-icon').style.display = 'block';
        publishedDate = null;
        updateDateTime();
    });

    document.getElementById('save-btn').addEventListener('click', function() {
        const blogData = {
            id: currentEditPost ? currentEditPost.id : Date.now(),
            heading: document.getElementById('blog-heading').value,
            content: document.getElementById('blog-content').value,
            image: document.getElementById('image-preview').src,
            date: document.getElementById('current-date-time').textContent,
            category: document.getElementById('category-dropdown').value,
            author: profileData.username
        };
        let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        if (currentEditPost) {
            const index = blogPosts.findIndex(post => post.id === currentEditPost.id);
            if (index !== -1) {
                blogPosts[index] = blogData;
            } else {
                blogPosts.push(blogData);
            }
        } else {
            blogPosts.push(blogData);
        }
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        console.log('Blog saved:', blogData);
        alert('Blog post saved successfully!');
    });

    document.getElementById('image-btn').addEventListener('click', function() {
        document.getElementById('image-upload').click();
    });

    document.getElementById('home-btn').addEventListener('click', function() {
        window.location.href = '/blogGenie';
    });

    document.getElementById('chatbot-btn').addEventListener('click', function() {
        window.location.href = '/blogGenie/chatbot'; 
    });

    document.getElementById('published-blogs-btn').addEventListener('click', function() {
        window.location.href = '/blogGenie/view';
    });

    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });

    document.getElementById('publish-btn').addEventListener('click', async function() {
        const publishedDate = new Date().toISOString();
        const blogData = {
            heading: document.getElementById('blog-heading').value,
            content: document.getElementById('blog-content').value,
            image: document.getElementById('image-preview').src,
            date: publishedDate,
            category: document.getElementById('category-dropdown').value,
            author: document.getElementById('profile-username').textContent
        };

        try {
            const response = await fetch('/blogGenie/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify(blogData)
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Blog published:', data);
                alert('Blog post published successfully!');
                window.location.href = '/blogGenie/profile';
            } else {
                console.error('Failed to publish blog:', data.error);
                alert('Failed to publish blog post.');
            }
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert('Error publishing blog post.');
        }
    });

    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const deleteImageIcon = document.getElementById('delete-image-icon');

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                deleteImageIcon.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    deleteImageIcon.addEventListener('click', function() {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        imageUpload.value = ''; // Clear the file input
        this.style.display = 'none';
    });

    document.getElementById('profile-box').addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

    document.addEventListener('click', function(e) {
        const profileBox = document.getElementById('profile-box');
        const profileBtn = document.getElementById('profile-btn');
        if (!profileBox.contains(e.target) && !profileBtn.contains(e.target)) {
            profileBox.style.display = 'none';
        }
    });

    document.getElementById('category-dropdown').addEventListener('change', updateDateTime);

    document.querySelector('.submit-btn').addEventListener('click', () => {
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;

        fetch('/blogGenie/login', {
            method: 'post',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Login successful') {
                // Redirect to the profile page
                window.location.href = '/blogGenie/profile';
            } else {
                // Handle login error
                console.error('Login failed:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Initialize
    updateDateTime();
    setInterval(updateDateTime, 60000);
    loadProfileData();
    loadCurrentEditPost();
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);