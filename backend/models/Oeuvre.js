const mongoose = require('mongoose'); // On importe Mongoose pour interagir avec MongoDB.

// Définition du schéma pour les œuvres (Oeuvre).  
const OeuvreSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  category: { type: String, required: true },  
  tags: { type: [String], required: true },  
  imageUrl: { type: String, required: true }  
});

 
module.exports = mongoose.model('Oeuvre', OeuvreSchema);