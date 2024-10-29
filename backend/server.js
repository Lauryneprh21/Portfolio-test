const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const nodemailer = require('nodemailer');
const User = require('./models/User');
const Oeuvre = require('./models/Oeuvre');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const { sendResetEmail } = require('./emailService');

dotenv.config();
const fs = require('fs');
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD
];

const Content = require('./models/Content');

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

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token invalide.' });
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.me.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/api/send-email', async (req, res) => {
  const { from_name, from_email, message } = req.body;
  if (!from_name || !from_email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    replyTo: from_email,
    to: process.env.EMAIL_USER,
    subject: `Nouveau message de ${from_name}`,
    text: message
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
});

const CLIENT_URL = process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL_PROD 
    : process.env.CLIENT_URL_LOCAL;

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = email === process.env.EMAIL_USER ? 'admin' : 'reader';
  const user = new User({ email, password: hashedPassword, role });
  await user.save();
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
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
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
  res.status(200).json({ token, user: { email: user.email, role: user.role }, message: 'Connexion réussie' });
});

app.get('/api/user', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
  res.status(200).json({ email: user.email, role: user.role });
});

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
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
    sendResetEmail(email, resetUrl)
      .then(() => res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' }))
      .catch((error) => {
        console.log('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

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







app.get('/api/oeuvres', async (req, res) => {
  try {
    const oeuvres = await Oeuvre.find();
    res.json(oeuvres);
  } catch (error) {
    console.error('Erreur lors de la récupération des œuvres:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des œuvres.' });
  }
});

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


 

app.put('/api/update-paragraph', authMiddleware, async (req, res) => {
  try {
    const updatedParagraph = req.body.paragraph;
    const content = await Content.findOneAndUpdate(
      { type: 'paragraph' },
      { text: updatedParagraph },
      { new: true, upsert: true }
    );
    res.status(200).json(content);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paragraphe:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du paragraphe." });
  }
});







app.put('/api/oeuvres/:id/visibility', async (req, res) => {
  try {
    const { id } = req.params;
    const oeuvre = await Oeuvre.findById(id);
    if (!oeuvre) return res.status(404).send('Œuvre non trouvée');

    oeuvre.isVisible = !oeuvre.isVisible;  
    await oeuvre.save();

    res.send(oeuvre);
  } catch (error) {
    console.error('Failed to update visibility:', error);
    res.status(500).send('Erreur du serveur');
  }
});




app.put('/api/oeuvres/:id', async (req, res) => {
  try {
    const updatedOeuvre = await Oeuvre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOeuvre);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'œuvre:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'œuvre.' });
  }
});

app.delete('/api/oeuvres/:id', async (req, res) => {
  try {
    await Oeuvre.findByIdAndDelete(req.params.id);
    res.json({ message: 'Oeuvre supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'œuvre:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'œuvre.' });
  }
});

app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    console.error('Erreur lors de la récupération des tags:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des tags.' });
  }
});

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

app.delete('/api/tags/:id', async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag non trouvé' });
    }
    res.json({ message: 'Tag supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des catégories.' });
  }
});

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

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la catégorie.' });
  }
});

const clientBuildPath = path.join(__dirname, '../frontend/build');
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
