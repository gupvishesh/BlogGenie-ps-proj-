const categories = [
    { name: 'Food', image: '/images/Daltadka.jpeg' },
    { name: 'Business', image: '/images/business.jpeg' },
    { name: 'Health Fitness', image: '/images/fitness.jpeg' },
    { name: 'Travel', image: '/images/Travel.jpeg' },
    { name: 'Career', image: '/images/career.jpeg' },
];

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

async function loadBlogPosts(category) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';

    try {
        const url = category
            ? `/blogGenie/blogs/category/${encodeURIComponent(category)}`
            : '/blogGenie/allblogs';
            
        const response = await fetch(url);
        const blogPosts = await response.json();
        
        if (blogPosts.length === 0) {
            console.log(category 
                ? `No blogs found in category: ${category}`
                : 'No blogs found');
        }

        blogPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.heading}">
                <div class="blog-info">
                    <div class="blog-author">${post.author.userName}</div>
                    <div class="blog-title">${post.heading}</div>
                    <div class="blog-category">${post.category || 'Uncategorized'}</div>
                </div>
            `;
            postElement.addEventListener('click', () => openBlogModal(post));
            blogGrid.appendChild(postElement);
        });
    } catch (error) {
        console.error('Failed to load blog posts:', error.message);
        blogGrid.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    }
}

async function filterBlogsByCategory(category) {
    loadBlogPosts(category);
}

function openBlogModal(post) {
    const modal = document.getElementById('blog-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalDateTime = modal.querySelector('#modal-date-time');
    const modalCategory = modal.querySelector('#modal-category');
    const modalTitle = modal.querySelector('.modal-title');
    const modalContent = modal.querySelector('.modal-content-text');

    modalImage.src = post.image;
    modalDateTime.textContent = new Date(post.createdAt).toLocaleString().split(',')[0]; // Ensure proper date formatting
    modalCategory.textContent = post.category || 'Uncategorized';
    modalTitle.textContent = post.heading;
    modalContent.textContent = post.content;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

async function searchBlogs(query) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '<p>Searching...</p>';

    if (!query || query.length < 2) {
        loadBlogPosts();
        return;
    }

    try {
        const response = await fetch(`/blogGenie/blogs/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        blogGrid.innerHTML = '';

        if (!Array.isArray(posts) || posts.length === 0) {
            blogGrid.innerHTML = '<p>No blogs found matching your search.</p>';
            return;
        }

        posts.forEach(post => {
            if (!post) return; // Skip if post is null/undefined
            
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            
            const image = post.image || '/images/default-blog-image.jpg';
            const heading = post.heading || 'Untitled';
            const category = post.category || 'Uncategorized';
            const authorName = post.authorName || 'Unknown Author';

            postElement.innerHTML = `
                <img src="${image}" alt="${heading}" onerror="this.src='/images/default-blog-image.jpg'">
                <div class="blog-info">
                    <div class="blog-author">${authorName}</div>
                    <div class="blog-title">${heading}</div>
                    <div class="blog-category">${category}</div>
                </div>
            `;
            
            postElement.addEventListener('click', () => openBlogModal(post));
            blogGrid.appendChild(postElement);
        });
    } catch (error) {
        console.error('Search failed:', error.message);
        blogGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to perform search at this time.</p>
                <button onclick="loadBlogPosts()" class="reload-btn">Show All Blogs</button>
            </div>
        `;
    }
}

// Add debouncing to search input to improve performance
let searchTimeout;
document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        loadBlogPosts();
        return;
    }
    
    // Increased debounce time to 500ms for better performance
    searchTimeout = setTimeout(() => {
        searchBlogs(query);
    }, 500);
});

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
        document.body.style.overflow = 'auto';  //Re-enable scrolling
    }
});

loadCategories();
loadBlogPosts();