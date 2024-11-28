// Import the required modules
const mongoose = require("mongoose"); // Mongoose is used for MongoDB object modeling
const bcrypt = require('bcrypt'); // Bcrypt is used for hashing passwords
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema(
    {
        // Define the userName field
        userName: {
            type: String, // The data type is String
            required: true, // This field is required
            unique: true, // This field must be unique
            lowercase: true // Convert the value to lowercase before saving
        },
        // Define the email field
        email: {
            type: String, // The data type is String
            required: true, // This field is required
            unique: true, // This field must be unique
            lowercase: true // Convert the value to lowercase before saving
        },
        // Define the password field
        password: {
            type: String, // The data type is String
            required: true, // This field is required
        }
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
    // Check if the password field is modified
    if (!this.isModified('password')) {
        return next(); // If not, proceed to the next middleware or save operation
    }
    try {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Proceed to the next middleware or save operation
    } catch (err) {
        next(err); // Pass any errors to the next middleware
    }
});

// Method to compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    // Compare the candidate password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;