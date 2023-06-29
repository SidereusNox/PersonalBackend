const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const secretKey = crypto.randomBytes(64).toString('hex');

const uri = 'mongodb://localhost:27017';
const collectionName = 'users';

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/test', async (req, res) => {
  res.json({message: 'Server reachable'});
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const collection = client.db('users').collection(collectionName);
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if(!isCorrectPassword){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, secretKey);

    res.json({ token });
    await client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
