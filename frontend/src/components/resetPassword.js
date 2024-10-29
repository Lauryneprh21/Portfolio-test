const mongoose = require('mongoose'); // ODM pour MongoDB, permet de modéliser les données et interagir avec la base de données.
const bcrypt = require('bcryptjs'); // Bibliothèque pour hacher les mots de passe.
const dotenv = require('dotenv'); // Charge les variables d'environnement à partir d'un fichier .env.
const User = require('./models/User'); // Modèle utilisateur pour MongoDB, définit la structure des documents utilisateur dans la collection.

dotenv.config(); // Charge les variables d'environnement à partir du fichier `.env`.

 
const resetPassword = async () => {
  try {
 
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    
    const email = 'admin@example.com';
    const newPassword = 'admin'; 

   
    const hashedPassword = await bcrypt.hash(newPassword, 10);

 
    const user = await User.findOneAndUpdate(
      { email }, 
      { password: hashedPassword }, 
      { new: true }  
    );

    // Si l'utilisateur a été trouvé et mis à jour, affiche un message de succès.
    if (user) {
      console.log(`Password for ${email} has been reset.`);
    } else {
     
      console.log(`User with email ${email} not found.`);
    }
  } catch (error) {
   
    console.error('Error resetting password:', error);
  } finally {
   
    mongoose.connection.close();
  }
};


resetPassword();