const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Define routes for blog operations
router.post('/blogs', blogController.createBlogPost);
router.get('/blogs', blogController.getAllBlogPosts);
router.get('/blogs/:id', blogController.getBlogPostById);
router.put('/blogs/:id', blogController.updateBlogPost);
router.delete('/blogs/:id', blogController.deleteBlogPost);

module.exports = router;