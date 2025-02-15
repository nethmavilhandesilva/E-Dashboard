const express = require("express");
const cors = require("cors");
require("./db/config");  // MongoDB connection
const User = require('./db/User');
const Product = require('./db/Product');  // User model
const app = express();

app.use(express.json());
app.use(cors());

// POST route for user registration
app.post("/register", async (req, res) => {
    try {
        // Create and save user with ALL received fields
        const newUser = new User(req.body);
        await newUser.save();
        result = result.toObject();
        delete result.password

        // Send back the exact input data in the response
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
});
app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user)
        } else {
            resp.send({ result: "No User Found" })
        }
    } else {
        resp.send({ result: "No User Found" })
    }

})
app.post("/add-product",async(req,resp)=>{
    let product= new Product(req.body);
    let result = await product.save();
    resp.send(result);
});
app.get("/products",async(req,resp)=>{
    const products = await Product.find();
    if(products.length>0){
        resp.send(products)
    }else{
        resp.send({result:"No Product Found"})
    }
    
})
app.delete("/product/:id",async(req,resp)=>{
    let result =await Product.deleteOne({_id:req.params.id})
    resp.send(result)
})
// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
