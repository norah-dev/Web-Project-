const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ اتصال بقاعدة بيانات MongoDB المحلية
mongoose.connect('mongodb://127.0.0.1:27017/global_bites', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// ✅ نموذج المستخدم (User)
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// ✅ نموذج المفضلات (Favorite)
const favoriteSchema = new mongoose.Schema({
  dish: String
});
const Favorite = mongoose.model("Favorite", favoriteSchema);

// ✅ تسجيل الدخول
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, message: "✅ Login successful" });
    } else {
      res.status(401).json({ success: false, message: "❌ Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ✅ إضافة وصفة للمفضلة
app.post('/add-favorite', async (req, res) => {
  const { item } = req.body;
  if (!item) {
    return res.status(400).json({ success: false, message: "No item provided" });
  }

  try {
    const fav = new Favorite({ dish: item });
    await fav.save();
    res.json({ success: true, message: "✅ Added to favorites" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add", error: err.message });
  }
});

// ✅ عرض جميع المفضلات
app.get('/favorites', async (req, res) => {
  try {
    const list = await Favorite.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
