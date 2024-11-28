const categories = [
    { name: 'Food', image: '/images/Daltadka.jpeg'},
    { name: 'Business', image: '/images/business.jpeg' },
    //{ name: 'Personal', image: 'https://source.unsplash.com/random/100x100?personal' },
    { name: 'Health Fitness', image: '/images/fitness.jpeg' },
    { name: 'Travel', image: '/images/Travel.jpeg' },
    { name: 'Career', image: '/images/career.jpeg' },
    //{ name: 'Others', image: 'https://source.unsplash.com/random/100x100?others' }
];

// Function to load categories
function loadCategories() {
    const categoryList = document.getElementById('category-list');
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <img src="${category.image}" alt="${category.name}" class="category-image">
            <span>${category.name}</span>
        `;
        categoryItem.addEventListener('click', () => filterBlogsByCategory(category.name));
        categoryList.appendChild(categoryItem);
    });
}

// Function to load blog posts
function loadBlogPosts(category = null) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';
    
    // Retrieve blog posts from localStorage
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
        const blogPosts = JSON.parse(storedPosts);
        
        const filteredPosts = category && category !== 'Others'
            ? blogPosts.filter(post => post.category === category)
            : blogPosts;

        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.heading}">
                <div class="blog-info">
                    <div class="blog-author">${post.author}</div>
                    <div class="blog-title">${post.heading}</div>
                    <div class="blog-category">${post.category || 'Uncategorized'}</div>
                </div>
            `;
            postElement.addEventListener('click', () => openBlogModal(post));
            blogGrid.appendChild(postElement);
        });
    }
}

// Function to filter blogs by category
function filterBlogsByCategory(category) {
    loadBlogPosts(category);
}

// Function to open blog modal
function openBlogModal(post) {
    const modal = document.getElementById('blog-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalDateTime = modal.querySelector('#modal-date-time');
    const modalCategory = modal.querySelector('#modal-category');
    const modalTitle = modal.querySelector('.modal-title');
    const modalContent = modal.querySelector('.modal-content-text');

    modalImage.src = post.image;
    modalDateTime.textContent = post.date;
    modalCategory.textContent = post.category || 'Uncategorized';
    modalTitle.textContent = post.heading;
    modalContent.textContent = post.content;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Function to search blogs
function searchBlogs(query) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';
    
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
        const blogPosts = JSON.parse(storedPosts);
        const filteredPosts = blogPosts.filter(post => 
            post.heading.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        );

        filteredPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.heading}">
                <div class="blog-info">
                    <div class="blog-author">${post.author}</div>
                    <div class="blog-title">${post.heading}</div>
                    <div class="blog-category">${post.category || 'Uncategorized'}</div>
                </div>
            `;
            postElement.addEventListener('click', () => openBlogModal(post));
            blogGrid.appendChild(postElement);
        });
    }
}

// Event listeners
document.getElementById('home-btn').addEventListener('click', () => window.location.href = '/blogGenie');
document.getElementById('profile-btn').addEventListener('click', () => window.location.href = '/blogGenie/profile');
document.getElementById('editor-btn').addEventListener('click', () => window.location.href = '/blogGenie/new');

document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('blog-modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('blog-modal')) {
        
        document.getElementById('blog-modal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});

document.getElementById('search-input').addEventListener('input', (e) => {
    searchBlogs(e.target.value);
});

// Initialize the page
loadCategories();
loadBlogPosts();
