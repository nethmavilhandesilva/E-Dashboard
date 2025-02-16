const express = require("express");
const cors = require("cors");
require("./db/config");  // MongoDB connection
const User = require('./db/User');
const Product = require('./db/Product');  // Product model
const app = express();
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

app.use(express.json());
app.use(cors());

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: "Access Denied" });

    Jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded.user;
        next();
    });
};

// POST route for user registration
app.post("/register", async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const newUser = new User(req.body);
        await newUser.save();
        const result = newUser.toObject();
        delete result.password;
        Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                res.send({ result: "Something went wrong, please try again later." });
            } else {
                res.send({ result, auth: token });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// POST route for user login
app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Something went wrong, please try again later." });
                } else {
                    res.send({ user, auth: token });
                }
            });
        } else {
            res.send({ result: "No User Found" });
        }
    } else {
        res.send({ result: "No User Found" });
    }
});

// POST route for adding a product
app.post("/add-product", authMiddleware, async (req, res) => {
    let product = new Product(req.body);
    try {
        let result = await product.save();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error adding product" });
    }
});

// GET route for fetching all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "No Product Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products" });
    }
});

// DELETE route for removing a product by ID
app.delete("/product/:id",async (req, res) => {
    try {
        let result = await Product.deleteOne({ _id: req.params.id });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product" });
    }
});

// GET route for fetching a single product by ID
app.get("/product/:id", async (req, res) => {
    try {
        let result = await Product.findOne({ _id: req.params.id });
        if (result) {
            res.send(result);
        } else {
            res.send({ result: "No Record Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product" });
    }
});

// PUT route for updating a product by ID
app.put("/product/:id", authMiddleware, async (req, res) => {
    try {
        let result = await Product.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product" });
    }
});

// GET route for searching products
app.get("/search/:key", verifyToken, async (req, res) => {
    try {
        let result = await Product.find({
            "$or": [
                { name: { $regex: req.params.key, $options: 'i' } },
                { company: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } }
            ]
        });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching products" });
    }
});

// Token verification middleware
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).json({ message: "Access Denied" });
    }
    Jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded.user;
        next();
    });
}

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
