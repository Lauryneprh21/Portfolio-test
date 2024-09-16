const mongoose = require('mongoose'); // On importe Mongoose pour interagir avec MongoDB.

 
const TagSchema = new mongoose.Schema({
  name: { type: String, required: true }  
});

 
module.exports = mongoose.model('Tag', TagSchema);