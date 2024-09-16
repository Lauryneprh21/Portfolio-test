const express = require('express'); // On importe express pour créer l'application backend.
const mongoose = require('mongoose'); // Mongoose sert à interagir avec MongoDB.
const bcrypt = require('bcryptjs'); // Bcrypt pour hacher les mots de passe (en cryptant).
const cors = require('cors'); // CORS pour gérer les restrictions de cross-origin.
const jwt = require('jsonwebtoken'); // JWT (JSON Web Token) pour générer des tokens d'authentification.
const dotenv = require('dotenv'); // dotenv pour charger les variables d'environnement depuis un fichier .env.
const path = require('path'); // Path pour gérer et manipuler les chemins de fichiers.
const nodemailer = require('nodemailer');  // Nodemailer pour envoyer des emails.
const User = require('./models/User'); // Le modèle User pour MongoDB.
const Oeuvre = require('./models/Oeuvre'); // Le modèle Oeuvre pour MongoDB.
const Category = require('./models/Category'); // Le modèle Category pour MongoDB.
const Tag = require('./models/Tag'); // Le modèle Tag pour MongoDB.
const { sendResetEmail } = require('./emailService'); // Service d'envoi d'emails pour les réinitialisations de mot de passe.

dotenv.config(); // Chargement des variables d'environnement depuis le fichier .env.

const fs = require('fs');
const app = express(); // Initialisation de l'application Express.

// Définition des origines autorisées pour CORS  
const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL, // URL du frontend local pendant le développement.
  process.env.CLIENT_URL_PROD   // URL du frontend en production.
];

// Configuration des options CORS pour permettre l'accès aux ressources depuis les domaines autorisés.
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('La politique CORS de ce site ne permet pas l\'accès à cette origine.'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions)); // Activation de CORS avec les options configurées.
app.use(express.json()); // Middleware pour parser les requêtes JSON.

// Connexion à MongoDB avec les paramètres définis dans le fichier .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));








// Configuration du transporteur Nodemailer pour envoyer des emails via iCloud.
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.me.com',
  port: 587,  // Utilisation du port non sécurisé avec STARTTLS.
  secure: false,  // Pas de SSL direct, mais STARTTLS.
  auth: {
    user: 'lauryne.prh@icloud.com', // Adresse email utilisée pour envoyer les emails.
    pass: process.env.EMAIL_PASS  // Mot de passe récupéré depuis le fichier .env.
  },
  tls: {
    rejectUnauthorized: false // Permet d'éviter les erreurs de certificat non autorisé.
  }
});









// Route pour envoyer un email. Prend en entrée l'email de l'utilisateur et son message.
app.post('/api/send-email', async (req, res) => {
  const { from_name, from_email, message } = req.body;

  // Vérification des champs obligatoires.
  if (!from_name || !from_email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  
  const mailOptions = {
    from: 'lauryne.prh@icloud.com',   
    replyTo: from_email,   
    to: 'lauryne.prh@icloud.com',   
    subject: `Nouveau message de ${from_name}`,  // Sujet de l'email.
    text: message   
  };

  try {
    // Envoi de l'email via le transporteur.
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Utilisation du bon URL du frontend selon l'environnement (développement ou production).
const CLIENT_URL = process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL_PROD 
    : process.env.CLIENT_URL_LOCAL;


app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  // Vérification que les champs email et mot de passe sont présents.
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  // Vérifie si l'utilisateur existe déjà dans la base de données.
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

 
  const hashedPassword = await bcrypt.hash(password, 10);

  // Assigner un rôle d'admin à un email particulier, sinon c'est un simple lecteur.
  const role = email === 'lauryne.prh@icloud.com' ? 'admin' : 'reader';

  // Création d'un nouvel utilisateur avec son email, mot de passe haché, et son rôle.
  const user = new User({ email, password: hashedPassword, role });
  await user.save();

  // Génération d'un token JWT pour l'utilisateur.
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
  
  // Réponse envoyée après l'inscription, contenant le token et les informations de l'utilisateur.
  res.status(201).json({ token, user: { email: user.email, role: user.role }, message: 'Inscription réussie' });
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe.
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Génération du token JWT si la connexion réussit.
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
  
 
  res.status(200).json({ token, user: { email: user.email, role: user.role }, message: 'Connexion réussie' });
});

// Route pour récupérer les informations de l'utilisateur à partir du token JWT.
app.get('/api/user', async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  res.status(200).json({ email: user.email, role: user.role });
});

// Route pour initier le processus de réinitialisation du mot de passe.
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email est requis' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Génération d'un token JWT temporaire (expirant en 1 heure) pour la réinitialisation.
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
   
    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

    // Utilisation d'une fonction pour envoyer l'email de réinitialisation.
    sendResetEmail(email, resetUrl)
      .then((response) => {
        return res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });
      })
      .catch((error) => {
        console.log('Erreur lors de l\'envoi de l\'email:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour réinitialiser le mot de passe à partir du token.
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Le mot de passe est requis' });
  }

  try {
    
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
 
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

 
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer toutes les œuvres (Oeuvre) stockées dans la base de données.
app.get('/api/oeuvres', async (req, res) => {
  try {
    const oeuvres = await Oeuvre.find();
    res.json(oeuvres);
  } catch (error) {
    console.error('Erreur lors de la récupération des œuvres:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des œuvres.' });
  }
});

// Route pour créer une nouvelle œuvre.
app.post('/api/oeuvres', async (req, res) => {
  try {
    const newOeuvre = new Oeuvre(req.body);
    await newOeuvre.save();
    res.json(newOeuvre);
  } catch (error) {
    console.error('Erreur lors de la création de l\'œuvre:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'œuvre.' });
  }
});

// Route pour mettre à jour une œuvre existante.
app.put('/api/oeuvres/:id', async (req, res) => {
  try {
    const updatedOeuvre = await Oeuvre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOeuvre);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'œuvre:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'œuvre.' });
  }
});

// Route pour supprimer une œuvre existante.
app.delete('/api/oeuvres/:id', async (req, res) => {
  try {
    await Oeuvre.findByIdAndDelete(req.params.id);
    res.json({ message: 'Oeuvre supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'œuvre:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'œuvre.' });
  }
});

// Route pour récupérer tous les tags stockés dans la base de données.
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des tags.' });
  }
});

// Route pour créer un nouveau tag.
app.post('/api/tags', async (req, res) => {
  try {
    const newTag = new Tag(req.body);
    await newTag.save();
    res.json(newTag);
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du tag.' });
  }
});

// Route pour supprimer un tag existant.
app.delete('/api/tags/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByIdAndDelete(tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }
    res.json({ message: 'Tag supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer toutes les catégories stockées dans la base de données.
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories.' });
  }
});

// Route pour créer une nouvelle catégorie.
app.post('/api/categories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la catégorie.' });
  }
});

// Chemin vers le dossier de build du front-end
const clientBuildPath = path.join(__dirname, '../frontend/build');
console.log('Chemin vérifié :', clientBuildPath);

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.error('Le dossier frontend/build est introuvable.');
}



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});