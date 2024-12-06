// Import required dependencies
const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Middleware to verify user authentication
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const Blog = require('../models/blogs');
const app=express();
app.use(express.json());
// Create a new blog post

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

// IMPORTANT: Move these routes to the top, before any routes with :id parameters
// Search functionality - must be before other routes with parameters
router.get('/blogs/search', verifyToken, async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]);
    }
    
    try {
        const blogs = await Blog.find({
            $or: [
                { heading: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        })
        .populate({
            path: 'author',
            select: 'userName'
        })
        .lean()  // Convert to plain JavaScript object
        .exec();

        const formattedBlogs = blogs.map(blog => ({
            ...blog,
            authorName: blog.author?.userName || 'Unknown Author',
            date: blog.createdAt
        }));

        // Log only if there's an issue with results
        if (formattedBlogs.length === 0) {
            console.log(`No search results found for query: "${query}"`);
        }

        res.json(formattedBlogs);
    } catch (error) {
        console.error('Search operation failed:', error.message);
        res.status(500).json([]);  // Return empty array instead of error
    }
});

// Get blogs by category - move this before parameterized routes too
router.get('/blogs/category/:category', verifyToken, async (req, res) => {
    const category = req.params.category;
    try {
        const blogs = await Blog.find(category === 'Others' ? {} : { category }).sort({ createdAt: -1 }).populate('author');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching blogs by category' });
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