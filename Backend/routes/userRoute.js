const { Router } = require("express"); // Import the Router function from Express
const multer = require("multer"); // Import Multer for handling file uploads
const path = require("path"); // Import Path for handling file paths
const userController = require("../controllers/userController"); // Import the user controller
const jwt = require('jsonwebtoken'); // Import JWT for token verification
const User = require('../models/blogusers'); // Import the User model
const Blog = require('../models/blogs'); // Import the Blog model
//const verifyToken = require('../services/authentication.js'); // Import the verifyToken middleware
const router = Router(); // Create a new router instance

// Configure Multer storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`)); // Set the destination folder for uploads
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`; // Create a unique filename using the current timestamp
        cb(null, fileName); // Pass the filename to the callback
    },
});

// Create an upload instance with the storage settings
const upload = multer({ storage: storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found, redirecting to login");
        return res.redirect('/blogGenie/login');
    }
    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
        if (err) {
            console.log("Token verification failed, redirecting to login");
            return res.redirect('/blogGenie/login');
        }
        console.log("Token verified for user:", decoded.id);
        req.user = decoded;
        next();
    });
};

// Define a route for the home page
router.get("/", (req, res) => {
    res.render("index.ejs"); // Render the index.ejs template
});

// Define a route for the login page
router.get("/login", (req, res) => {
    res.render("login.ejs"); // Render the login.ejs template
});

// Define a route for the signup page
router.get("/signup", (req, res) => {
    res.render("signup.ejs"); // Render the signup.ejs template
});

// Define a route for the profile page with token verification
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.redirect('/blogGenie/login');
        }
        
        // Fetch blogs where author matches the user's ID
        const userBlogs = await Blog.find({ author: req.user.id })
            .sort({ createdAt: -1 }); // Sort by newest first
        
        console.log("Found blogs:", userBlogs); // Debug log
        res.render("profile.ejs", { 
            user: user, 
            userBlogs: userBlogs 
        });
    } catch (error) {
        console.error("Error in profile route:", error);
        res.redirect('/blogGenie/login');
    }
});

// Define a route for the new page
router.get("/new", (req, res) => {
    res.render("new.ejs"); // Render the new.ejs template
});

// Define a route for the view page
router.get("/view", (req, res) => {
    res.render("view.ejs"); // Render the view.ejs template
});

// Define a route for the chatbot page
router.get("/chatbot", (req, res) => {
    res.render("chatbot.ejs"); // Render the chatbot.ejs template
});

// Logout route
router.get("/logout", (req, res) => {
    // Clear the 'token' cookie
    res.clearCookie("token");
    // Redirect to the login page after logout
    res.redirect("/blogGenie/login");
});

// User registration route
router.post("/signup", userController.registerUser);

// User login route
router.post("/login", userController.loginUser);

// Export the router and verifyToken middleware
module.exports = router;
module.exports.verifyToken = verifyToken;
