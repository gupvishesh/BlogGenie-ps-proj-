const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');


// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://Arnav_Agarwal:Arnav2005@cluster0.no81p.mongodb.net/SampleDatabase1?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connection to MongoDB Atlas successful'))
    .catch(err => console.log('Error connecting to MongoDB Atlas:', err));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add logging for each middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Apply authentication middleware before routes
app.use(checkForAuthenticationCookie('token'));

// Routes
app.use('/blogGenie', userRoute);
app.use('/blogGenie', blogRoute);

// Assuming you have an Express app instance named 'app'
app.get('/blogGenie/profile', (req, res) => {
    // Render the profile page
    res.render('profile', { user: req.user }); // Pass user data if needed
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/blogGenie`);
});
