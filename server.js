const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // يخدم ملفات HTML من نفس المجلد

mongoose.connect('mongodb://127.0.0.1:27017/globalbites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error", err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const favoriteSchema = new mongoose.Schema({
  userEmail: String,
  dish: {
    name: String,
    ingredients: String,
    preparation: String,
    image: String
  }
});

const User = mongoose.model('User', userSchema);
const Favorite = mongoose.model('Favorite', favoriteSchema);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, message: 'Login successful', email });
  } else {
    res.json({ success: false, message: 'Invalid email or password' });
  }
});

app.post('/add-favorite', async (req, res) => {
  const { userEmail, dish } = req.body;
  if (!userEmail || !dish) {
    return res.json({ success: false, message: 'Missing data' });
  }

  await Favorite.create({ userEmail, dish });
  res.json({ success: true });
});

app.get('/favorites', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.json([]);
  const favorites = await Favorite.find({ userEmail: email });
  res.json(favorites);
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

