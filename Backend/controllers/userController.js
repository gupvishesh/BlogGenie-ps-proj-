const mongoose = require('mongoose');
const User = require('../models/blogusers');
const jwt = require('jsonwebtoken');

// Log the MongoDB URI
console.log(`MongoDB URI: ${mongoose.connection.host}`);

// Log the collection names
mongoose.connection.on('open', () => {
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Collections:', collections.map(col => col.name));
        }
    });
});

const handleErrors = (err) => {
    let errors = { email: '', password: '' };
    
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }
    
    return errors;
};

const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = new User({ userName, email, password });
        await user.save();
        res.redirect('/blogGenie/login');
    } catch (error) {
        const errors = handleErrors(error);
        res.status(500).render('signup.ejs', { errors });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log("Login attempt with email:", req.body.email);
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).render('login.ejs', { error: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Password mismatch for email:", email);
            return res.status(401).render('login.ejs', { error: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
        console.log("Generated JWT token for user:", user._id);
        res.cookie('token', token, { httpOnly: true });
        console.log("Redirecting to profile page for user:", user._id);
        res.redirect('/blogGenie/profile');
    } catch (error) {
        console.error("Login failed for email:", req.body.email, "Error:", error);
        res.status(401).render('login.ejs', { error: "Login failed" });
    }
};

module.exports = {
    registerUser,
    loginUser
};