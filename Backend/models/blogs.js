const mongoose = require("mongoose"); // Mongoose is used for MongoDB object modeling

// Define the post schema
const postSchema = new mongoose.Schema(
    {
        // Define the title field
        title: {
            type: String, // The data type is String
            required: true // This field is required
        },
        // Define the content field
        content: {
            type: String, // The data type is String
            required: true // This field is required
        },
        // Define the author field
        author: {
            type: mongoose.Schema.Types.ObjectId, // The data type is ObjectId, referencing the User model
            ref: "User", // Reference to the User model
            required: true // This field is required
        },
        // Define the status field
        status: {
            type: String, // The data type is String
            enum: ["Draft", "Published", "Archived"], // The value must be one of these options
            default: "Draft" // The default value is "Draft"
        },
        // Define the createdAt field
        createdAt: {
            type: Date, // The data type is Date
            default: Date.now // The default value is the current date and time
        },
        // Define the prompt field
        prompt: {
            type: String // The data type is String
        },
        // Define the category field
        category: {
            type: String // The data type is String
        },
        // Define the userId field
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the PostModel from the schema
const PostModel = mongoose.model('PostModel', postSchema);

// Export the PostModel
module.exports = PostModel;