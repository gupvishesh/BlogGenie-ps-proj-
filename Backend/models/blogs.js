const mongoose = require('mongoose');

// Define the blog schema
const blogSchema = new mongoose.Schema({
    // Required blog title
    heading: { 
        type: String, 
        required: true 
    },
    
    // Main content of the blog
    content: { 
        type: String, 
        required: true 
    },
    
    // Optional image URL
    image: { 
        type: String 
    },
    
    // Blog category (optional)
    category: { 
        type: String 
    },
    
    // Publication date string
    date: { 
        type: String 
    },
    
    // Automatic timestamp for creation
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // Reference to User model (the author)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Duplicate reference to user for easier querying
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Author's name stored directly for performance
    authorName: { 
        type: String,
        required: true 
    }
}, 
// Enable automatic timestamps (createdAt, updatedAt)
{ timestamps: true });

// Export the model
module.exports = mongoose.model('Blog', blogSchema);