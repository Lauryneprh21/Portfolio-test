const mongoose = require('mongoose'); // On importe Mongoose, qui est l'ODM (Object Data Modeling) pour interagir avec MongoDB.

// Définition du schéma pour les catégories.  
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }  
});

 
module.exports = mongoose.model('Category', CategorySchema);