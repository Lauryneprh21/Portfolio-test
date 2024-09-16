const mongoose = require('mongoose'); // On importe Mongoose pour interagir avec MongoDB.

// Définition du schéma pour les utilisateurs (User).  
const userSchema = new mongoose.Schema({
  email: { 
    type: String,  
    required: true,  
    unique: true  
  },
  password: { 
    type: String, // Le mot de passe de l'utilisateur est de type String.
    required: true // Le champ mot de passe est obligatoire.
  },
  role: { 
    type: String,  
    default: 'reader' // Par défaut, chaque utilisateur a le rôle 'reader', sauf si un autre rôle est spécifié.
  }
});

 
const User = mongoose.model('User', userSchema);

module.exports = User;  