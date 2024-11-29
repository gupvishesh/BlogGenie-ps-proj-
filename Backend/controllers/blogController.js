const BlogPost = require("../models/blogs");

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { heading, content, image, category } = req.body;
    const newBlogPost = new BlogPost({
      heading,
      content,
      image,
      category,
      author: req.user.userName,
      userId: req.user._id
    });
    await newBlogPost.save();
    res.status(201).json({ redirectTo: '/blogGenie/profile' });
  } catch (error) {
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