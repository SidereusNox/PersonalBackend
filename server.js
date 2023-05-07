const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

// Secret key for JWT
const secretKey = 'your_secret_key';

// MongoDB connection URI
const uri = 'mongodb://my-mongo-container:27017';

// MongoDB collection name
const collectionName = 'users';

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();

    // Get the user collection
    const collection = client.db().collection(collectionName);

    // Find the user by username and password
    const user = await collection.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, secretKey);

    res.json({ token });

    // Close the MongoDB connection
    await client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

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

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
