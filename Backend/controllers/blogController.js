const BlogPost = require("../models/blogs");
const User = require("../models/blogusers"); // Import User model

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { heading, content, image, category, date } = req.body;
    console.log('Received blog data:', req.body); // Log the received data
    console.log('Authenticated user:', req.user); // Log the authenticated user

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id); // Fetch user from DB
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newBlogPost = new BlogPost({
      heading,
      content,
      image,
      category,
      date,
      author: user.userName, // Set author from fetched user
      userId: req.user.id // Ensure id exists in req.user
    });

    await newBlogPost.save();
    console.log('Blog saved to database:', newBlogPost); // Log the saved blog post
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error saving blog post:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ userId: req.user._id });
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog post by ID
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

// Update a blog post
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

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add these new controller methods
exports.viewBlogPost = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.render('viewBlog', { blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

exports.getAllPublishedBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    res.render('published', { blogs }); // This will render the published.ejs template
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};