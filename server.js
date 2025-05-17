const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// رابط MongoDB المحلي (تأكد من تشغيل MongoDB و MongoDB Compass)
const uri = 'mongodb://127.0.0.1:27017';

app.use(cors());
app.use(bodyParser.json());

MongoClient.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Connected to MongoDB Compass');

    const db = client.db('globalbites');
    const usersCollection = db.collection('users');
    const favoritesCollection = db.collection('favorites');

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        await usersCollection.insertOne({ email, password });
        res.json({ message: '✅ User saved in MongoDB' });
      } catch (err) {
        res.status(500).json({ message: '❌ Error saving user', error: err });
      }
    });

    app.post('/favorites', async (req, res) => {
      const { email, dish } = req.body;
      try {
        await favoritesCollection.updateOne(
          { email },
          { $addToSet: { dishes: dish } }, 
          { upsert: true } 
        );
        res.json({ message: '✅ Dish added to favorites' });
      } catch (err) {
        res.status(500).json({ message: '❌ Error saving favorite', error: err });
      }
    });

  })
  .catch(err => console.error('❌ Failed to connect to MongoDB', err));


app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
