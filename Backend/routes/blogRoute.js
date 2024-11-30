const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Import verifyToken from userRoute or appropriate path
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const Blog = require('../models/blogs');

// Create a new blog post
router.post('/blogs', verifyToken, blogController.createBlogPost);

// View all published blogs (place this route first to avoid conflicts)
router.get('/view', blogController.getAllPublishedBlogs);

// Define routes for blog operations
router.get('/blogs', verifyToken, blogController.getAllBlogPosts);
router.get('/blogs/:id', verifyToken, blogController.getBlogPostById);
router.put('/blogs/:id', verifyToken, blogController.updateBlogPost);
router.delete('/blogs/:id', verifyToken, blogController.deleteBlogPost);

// Route to view a single blog
router.get('/blogs/view/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect('/blogGenie/profile');
        }
        res.render('viewBlog.ejs', { blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.redirect('/blogGenie/profile');
    }
});

// Route to edit a blog
router.get('/blogs/edit/:id', verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.render('editBlog.ejs', { blog });
    } catch (error) {
        console.error('Error fetching blog for edit:', error);
        res.redirect('/blogGenie/profile');
    }
});

// Route to delete a blog
router.delete('/blogs/:id', verifyToken, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.redirect('/blogGenie/profile');
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.redirect('/blogGenie/profile');
    }
});

module.exports = router;