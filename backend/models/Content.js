const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true },  
  text: { type: String, required: true }
});

module.exports = mongoose.model('Content', contentSchema);