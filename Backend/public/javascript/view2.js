const categories = [
    { name: 'food', image: '/images/Daltadka.jpeg' },
    { name: 'business', image: '/images/business.jpeg' },
    { name: 'health', image: '/images/fitness.jpeg' },
    { name: 'travel', image: '/images/Travel.jpeg' },
    { name: 'career', image: '/images/career.jpeg' },
    { name: 'personal', image: '/images/personal.jpeg' }
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
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '<div class="loading">Loading blogs...</div>';

    try {
        const url = `/blogGenie/blogs/category/${encodeURIComponent(category)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const blogs = await response.json();
        blogGrid.innerHTML = '';

        if (blogs.length === 0) {
            blogGrid.innerHTML = `<div class="no-results">No blogs found in ${category} category</div>`;
            return;
        }

        blogs.forEach(blog => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            
            const authorName = blog.author?.userName || 'Unknown Author';
            
            postElement.innerHTML = `
                <img src="${blog.image || '/images/default-blog-image.jpg'}" 
                     alt="${blog.heading}" 
                     onerror="this.src='/images/default-blog-image.jpg'">
                <div class="blog-info">
                    <div class="blog-author">${authorName}</div>
                    <div class="blog-title">${blog.heading}</div>
                    <div class="blog-category">${blog.category || 'Uncategorized'}</div>
                </div>
            `;
            
            postElement.addEventListener('click', () => openBlogModal(blog));
            blogGrid.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error filtering blogs:', error);
        blogGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load blogs: ${error.message}</p>
                <button onclick="loadBlogPosts()" class="reload-btn">Show All Blogs</button>
            </div>
        `;
    }
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
    
    if (!query || query.length < 2) {
        loadBlogPosts();
        return;
    }

    try {
        blogGrid.innerHTML = '<div class="loading">Searching...</div>';
        
        const response = await fetch(`/blogGenie/blogs/search?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Search failed');
        }

        blogGrid.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            blogGrid.innerHTML = '<div class="no-results">No blogs found matching your search.</div>';
            return;
        }

        data.forEach(blog => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            
            const authorName = blog.author?.userName || 'Unknown Author';
            
            postElement.innerHTML = `
                <img src="${blog.image || '/images/default-blog-image.jpg'}" 
                     alt="${blog.heading}" 
                     onerror="this.src='/images/default-blog-image.jpg'">
                <div class="blog-info">
                    <div class="blog-author">${authorName}</div>
                    <div class="blog-title">${blog.heading}</div>
                    <div class="blog-category">${blog.category || 'Uncategorized'}</div>
                </div>
            `;
            
            postElement.addEventListener('click', () => openBlogModal(blog));
            blogGrid.appendChild(postElement);
        });

    } catch (error) {
        console.error('Search error:', error);
        blogGrid.innerHTML = `
            <div class="error-message">
                <p>Search failed: ${error.message}</p>
                <button onclick="loadBlogPosts()" class="reload-btn">Show All Blogs</button>
            </div>
        `;
    }
}

// Update search input handler
let searchTimeout;
document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        loadBlogPosts();
        return;
    }
    
    searchTimeout = setTimeout(() => {
        searchBlogs(query);
    }, 300);
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