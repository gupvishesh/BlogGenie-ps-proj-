const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Import verifyToken from userRoute or appropriate path
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');

// Create a new blog post
router.post('/blogs', verifyToken, blogController.createBlogPost);

// View all published blogs (place this route first to avoid conflicts)
router.get('/view', blogController.getAllPublishedBlogs);

// Define routes for blog operations
router.get('/blogs', verifyToken, blogController.getAllBlogPosts);
router.get('/blogs/:id', verifyToken, blogController.getBlogPostById);
router.put('/blogs/:id', verifyToken, blogController.updateBlogPost);
router.delete('/blogs/:id', verifyToken, blogController.deleteBlogPost);
// Add these new routes
router.get('/blogs/view/:id', verifyToken, blogController.viewBlogPost);
router.get('/blogs/edit/:id', verifyToken, blogController.editBlogPost);

module.exports = router;