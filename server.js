const express = require("express");
const cors = require("cors");
require("./db/config");  // MongoDB connection
const User = require('./db/User');  // User model
const app = express();

app.use(express.json());
app.use(cors());

// POST route for user registration
app.post("/register", async (req, res) => {
    try {
        // Create and save user with ALL received fields
        const newUser = new User(req.body);
        await newUser.save();

        // Send back the exact input data in the response
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
