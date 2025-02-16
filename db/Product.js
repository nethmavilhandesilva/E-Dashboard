const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({}, { strict: false }); // Allows ANY field

module.exports = mongoose.model("products", productSchema);
