const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Oeuvre = require('./models/Oeuvre');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const { sendResetEmail } = require('./emailService');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://portfolio-frontend12-8e7f539b816a.herokuapp.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received email:', email);
  console.log('Received password:', password);

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log('User already exists');
    return res.status(400).json({ message: 'Utilisateur déjà existant' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = email === 'lauryne.prh@icloud.com' ? 'admin' : 'reader';
  const user = new User({ email, password: hashedPassword, role });

  await user.save();
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY);
  res.status(201).json({ token, user: { email: user.email, role: user.role }, message: 'Inscription réussie' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received email:', email);
  console.log('Received password:', password);

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Incorrect password');
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
  console.log('Received email for password reset:', email);

  if (!email) {
    return res.status(400).json({ message: 'Email est requis' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    console.log('Generated reset URL:', resetUrl);

    sendResetEmail(email, resetUrl)
      .then((response) => {
        console.log('EmailJS response:', response);
        return res.status(200).json({ message: 'Email de réinitialisation envoyé avec succès' });
      })
      .catch((error) => {
        console.log('Error sending EmailJS email:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
      });
  } catch (error) {
    console.log('Server error:', error);
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
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/oeuvres', async (req, res) => {
  const oeuvres = await Oeuvre.find();
  res.json(oeuvres);
});

app.post('/api/oeuvres', authMiddleware, isAdmin, async (req, res) => {
  const newOeuvre = new Oeuvre(req.body);
  await newOeuvre.save();
  res.json(newOeuvre);
});

app.put('/api/oeuvres/:id', authMiddleware, isAdmin, async (req, res) => {
  const updatedOeuvre = await Oeuvre.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedOeuvre);
});

app.delete('/api/oeuvres/:id', authMiddleware, isAdmin, async (req, res) => {
  await Oeuvre.findByIdAndDelete(req.params.id);
  res.json({ message: 'Oeuvre supprimée' });
});

app.delete('/api/tags/:id', authMiddleware, isAdmin, async (req, res) => {
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

app.get('/api/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

app.post('/api/categories', authMiddleware, isAdmin, async (req, res) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.json(newCategory);
});

app.get('/api/tags', async (req, res) => {
  const tags = await Tag.find();
  res.json(tags);
});

app.post('/api/tags', authMiddleware, isAdmin, async (req, res) => {
  const newTag = new Tag(req.body);
  await newTag.save();
  res.json(newTag);
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
