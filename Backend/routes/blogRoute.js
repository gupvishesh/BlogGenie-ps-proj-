const express = require('express');
const { verifyToken } = require("../routes/userRoute"); // Import verifyToken from userRoute or appropriate path
const router = express.Router();
const blogController = require('../controllers/blogController');
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const Blog = require('../models/blogs');
const app=express();
app.use(express.json());
// Create a new blog post
router.post('/blogs', verifyToken, blogController.createBlogPost);

// View all published blogs (place this route first to avoid conflicts)
// router.get('/view', blogController.getAllPublishedBlogs);

// Define routes for blog operations
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

// Search blogs by heading or category
router.get('/blogs/search', async (req, res) => {
    const query = req.query.q; // Get the search query from the request
    try {
        const blogs = await Blog.find({
            $or: [
                { heading: { $regex: query, $options: 'i' } }, // Case-insensitive search in heading
                { category: { $regex: query, $options: 'i' } } // Case-insensitive search in category
            ]
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error searching blogs' });
    }
});

// Get all blogs
router.get('/allblogs', async (req, res) => {
    const category = req.query.category; // Optionally get the category from query parameters
    try {
        const filter = category ? { category } : {}; // Use an empty filter to fetch all blogs
        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).populate('author');
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