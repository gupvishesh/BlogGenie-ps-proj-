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
        url= category
        ? `/blogGenie/blogs/category/${encodeURIComponent(category)}`  // Filter by category
        : '/blogGenie/allblogs'; // No category, so fetch all blogs
        // Fetch blogs from the API
        const response = await fetch(url);
        const blogPosts = await response.json();
        console.log("blogposts=",blogPosts);
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
        console.error('Error loading blog posts:', error);
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
    modalDateTime.textContent = new Date(post.date).toLocaleString(); // Ensure proper date formatting
    modalCategory.textContent = post.category || 'Uncategorized';
    modalTitle.textContent = post.heading;
    modalContent.textContent = post.content;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

async function searchBlogs(query) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';

    try {
        // Fetch search results from the API
        const response = await fetch(`/api/blogs/search?q=${encodeURIComponent(query)}`);
        const filteredPosts = await response.json();

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

        if (filteredPosts.length === 0) {
            blogGrid.innerHTML = '<p>No blogs found matching your query.</p>';
        }
    } catch (error) {
        console.error('Error searching blogs:', error);
        blogGrid.innerHTML = '<p>Error searching blogs. Please try again later.</p>';
    }
}

//Event listeners
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

document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        searchBlogs(query);
    } else {
        loadBlogPosts(); // Reload all blogs if the query is cleared
    }
});

loadCategories();
loadBlogPosts();