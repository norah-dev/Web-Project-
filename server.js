const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve HTML files from current directory

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/global_bites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Mongoose schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const favoriteSchema = new mongoose.Schema({
  userId: String,
  name: String,
  ingredients: String,
  preparation: String,
  image: String
});

const User = mongoose.model('User', userSchema);
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ success: true, message: '✅ Login successful', userId: user._id });
  } else {
    res.json({ success: false, message: '❌ Invalid email or password' });
  }
});

app.get('/favorites', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

  try {
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Redirect to login by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
