const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({}, { strict: false }); // Allows ANY field

module.exports = mongoose.model("User", userSchema);
