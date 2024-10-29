const mongoose = require('mongoose');

const OeuvreSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  imageUrl: { type: String, required: true },
  isVisible: { type: Boolean, default: true }

});

module.exports = mongoose.model('Oeuvre', OeuvreSchema);
