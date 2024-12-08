/**
 * Main application entry point
 * Sets up Express server, database connection, and middleware
 */

// Core dependencies
require('dotenv').config();           // Environment variables loader
const express = require('express');   // Web framework
const app = express();
const mongoose = require('mongoose'); // MongoDB ODM
const path = require('path');            // File path operations utility
const methodOverride = require('method-override');  // Middleware for HTTP method override
const cookieParser = require('cookie-parser');      // Parse Cookie header and populate req.cookies
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const BlogPost = require("./models/blogs");

/**
 * Database Connection
 * Connects to MongoDB with error handling and logging
 */
mongoose.connect("mongodb+srv://Arnav_Agarwal:Arnav2005@cluster0.no81p.mongodb.net/SampleDatabase1?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('✓ MongoDB connected successfully'))
    .catch(err => console.error('✗ MongoDB connection error:', err.message));
console.log('MongoDB URI:', process.env.MONGO_URI);

/**
 * Middleware Setup
 * Configures essential Express middleware and application settings
 */
app.use(express.urlencoded({ extended: true }));  // Form data parser
app.use(express.json());                          // JSON parser
app.use(methodOverride('_method'));               // Enable PUT/DELETE in forms
app.use(cookieParser());                          // Handle cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Replace verbose logging middleware with a more concise one
app.use((req, res, next) => {
    if (req.method !== 'GET' || req.url.includes('/api/')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Apply authentication middleware before routes
app.use(checkForAuthenticationCookie('token'));

// Routes
app.use('/blogGenie', userRoute);
app.use('/blogGenie', blogRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
⚡ Server is running at http://localhost:${PORT}/blogGenie
✓ API endpoints ready
`);
});