// Import required dependencies
const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Middleware to verify user authentication
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const Blog = require('../models/blogs');
const app=express();
app.use(express.json());
const mongoose = require('mongoose');
//const Blog = mongoose.model('Blog');

// Create a new blog post

// IMPORTANT: Move these routes to the top, before any routes with :id parameters
// Search functionality - must be before other routes with parameters
router.get('/blogs/search', async (req, res) => {
    try {
        const query = req.query.q;
        
        if (!query) {
            return res.json([]);
        }

        const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const blogs = await Blog.find({
            $or: [
                { heading: { $regex: sanitizedQuery, $options: 'i' } },
                { content: { $regex: sanitizedQuery, $options: 'i' } },
                { category: { $regex: sanitizedQuery, $options: 'i' } }
            ]
        })
        .populate('author', 'userName')
        .sort({ createdAt: -1 })
        .lean();

        res.status(200).json(blogs);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
});


// Create a new blog post - requires authentication
router.post('/blogs', verifyToken, blogController.createBlogPost);

// Get all blog posts for authenticated user
router.get('/blogs', verifyToken, blogController.getAllBlogPosts);
// router.get('/allblogs', verifyToken, blogController.getAllBlogs);
router.get('/blogs/:id', verifyToken, blogController.getBlogPostById);
// router.put('/blogs/edit/:id', verifyToken, blogController.updateBlogPost);

router.put('/blogs/edit/:id', async (req, res) => {
    console.log("req.body=",req.body);
    const blogId = req.params.id;
    const newHeading=req.body.blogheading; 
    const newContent=req.body.blogcontent; 
    const newImage=req.body.imageupload; 
    const newCategory=req.body.categorydropdown; 
    console.log("req.body=",req.body);
    try {
        // Use `updateOne` and wait for the Promise to resolve
        const result = await Blog.findByIdAndUpdate(blogId, {
            heading:newHeading,
            content:newContent,
            category:newCategory,
            image:newImage
        },{new:true});
        res.redirect("/blogGenie/profile");
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send({ error: 'Failed to update blog post' });
    }
});



router.delete('/blogs/:id', verifyToken, blogController.deleteBlogPost);

// Route to view a single blog



// Get blogs by category - move this before parameterized routes too
router.get('/blogs/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        
        let query = {};
        if (category !== 'Others') {
            // Case-insensitive category match
            query = { category: { $regex: new RegExp('^' + category + '$', 'i') } };
        }

        const blogs = await Blog.find(query)
            .populate('author', 'userName')
            .sort({ createdAt: -1 })
            .lean();

        // Add fallback values and transform data
        const transformedBlogs = blogs.map(blog => ({
            ...blog,
            author: {
                userName: blog.author?.userName || 'Unknown Author'
            },
            category: blog.category || 'Uncategorized',
            image: blog.image || '/images/default-blog-image.jpg'
        }));

        res.status(200).json(transformedBlogs);
    } catch (error) {
        console.error('Category filter error:', error);
        res.status(500).json({ 
            error: 'Failed to filter blogs by category',
            details: error.message 
        });
    }
});

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