/**
 * Blog Controller Module
 * Handles all blog-related operations including CRUD and view rendering
 */

const BlogPost = require("../models/blogs");
const User = require("../models/blogusers");

/**
 * Create Blog Post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * Validates user authentication and creates new blog post
 */
exports.createBlogPost = async (req, res) => {
    try {
        const { heading, content, image, category } = req.body;
        
        // Verify user authentication before proceeding
        if (!req.user || !req.user.id) {
            console.log('User not authenticated');
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the user to get their username
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newBlogPost = new BlogPost({
            heading,
            content,
            image,
            category,
            author: req.user.id,
            authorName: user.userName, // Add the author's name explicitly
            userId: req.user.id,
            createdAt: new Date()
        });

        const savedBlog = await newBlogPost.save();
        console.log('Blog saved successfully:', savedBlog);
        
        return res.status(201).json({
            message: 'Blog created successfully',
            blog: savedBlog
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        return res.status(500).json({ error: 'Failed to create blog' });
    }
};

/**
 * Get All Blog Posts
 * Retrieves all blogs for authenticated user
 */
exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find({ userId: req.user._id });
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Single Blog Operations
exports.getBlogPostById = async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id);
        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json(blogPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Blog Update Controller
exports.updateBlogPost = async (req, res) => {
    try {
        const { heading, content, image, category } = req.body;
        const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, { heading, content, image, category }, { new: true });
        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json({ message: "Blog post updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Blog Deletion Controller
exports.deleteBlogPost = async (req, res) => {
    try {
        const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!blogPost) {
            return res.redirect('/blogGenie/profile');
        }
        res.redirect('/blogGenie/profile');
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.redirect('/blogGenie/profile');
    }
};

// Blog View Controllers
exports.viewBlogPost = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id).populate('author', 'userName');
        if (!blog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        
        // Add the author's name to the blog object
        blog.authorName = blog.author.userName;
        
        res.render('viewBlog', { blog });
    } catch (error) {
        console.error('Error in viewBlogPost:', error);
        res.status(500).json({ error: error.message });
    }
};

// Blog Edit Controller
exports.editBlogPost = async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.render('blog-editor', { blog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Published Blogs Controller
exports.getAllPublishedBlogs = async (req, res) => {
    try {
        console.log("Blogs with populated authors:");
        const blogs = await BlogPost.find().sort({ createdAt: -1 }).populate('author');
        res.render('published', { blogs }); // This will render the published.ejs template
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBlogs=async(req,res)=>{
    try{
        const blogs = await BlogPost.find().sort({ createdAt: -1 }).populate('author');
        res.render('test', { blogs });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};