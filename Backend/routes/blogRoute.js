const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// View all published blogs (place this route first to avoid conflicts)
router.get('/view', blogController.getAllPublishedBlogs);

// Define routes for blog operations
router.post('/blogs', blogController.createBlogPost);
router.get('/blogs', blogController.getAllBlogPosts);
router.get('/blogs/:id', blogController.getBlogPostById);
router.put('/blogs/:id', blogController.updateBlogPost);
router.delete('/blogs/:id', blogController.deleteBlogPost);

// Add these new routes
router.get('/blogs/view/:id', blogController.viewBlogPost);
router.get('/blogs/edit/:id', blogController.editBlogPost);

module.exports = router;