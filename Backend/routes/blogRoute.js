// Import required dependencies
const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Middleware to verify user authentication
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const Blog = require('../models/blogs');

// Create a new blog post - requires authentication
router.post('/blogs', verifyToken, blogController.createBlogPost);

// Get all blog posts for authenticated user
router.get('/blogs', verifyToken, blogController.getAllBlogPosts);

// CRUD operations for individual blog posts
router.get('/blogs/:id', verifyToken, blogController.getBlogPostById); // Get single blog
router.put('/blogs/:id', verifyToken, blogController.updateBlogPost);  // Update blog
router.delete('/blogs/:id', verifyToken, blogController.deleteBlogPost); // Delete blog

// View single blog with full details
router.get('/blogs/view/:id', verifyToken, async (req, res) => {
    try {
        // Find blog by ID
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect('/blogGenie/profile');
        }
        // Render blog view template
        res.render('viewBlog.ejs', { blog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.redirect('/blogGenie/profile');
    }
});

// Search functionality
router.get('/blogs/search', async (req, res) => {
    const query = req.query.q; // Get search query parameter
    try {
        // Search blogs by heading or category, case-insensitive
        const blogs = await Blog.find({
            $or: [
                { heading: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error searching blogs' });
    }
});

// Get all blogs with optional category filter
router.get('/allblogs', async (req, res) => {
    const category = req.query.category;
    try {
        const filter = category ? { category } : {};
        // Find blogs, sort by creation date, and populate author details
        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .populate('author');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blogs' });
    }
});

// Get blogs by category
router.get('/blogs/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const blogs = await Blog.find(category === 'Others' ? {} : { category }).sort({ createdAt: -1 }).populate('author');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blogs by category' });
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