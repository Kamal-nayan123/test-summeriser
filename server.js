const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser'); // For parsing request bodies
require('dotenv').config(); // Load environment variables from a .env file

// MongoDB connection (replace with your MongoDB connection string)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Middleware
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true }));

// User model (replace with your actual user schema)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ... (Replace this with your actual password verification) ...
    if (user.password === password) {
      // ... (You would normally generate a JWT token and send it back to the client) ...
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port', process.env.PORT || 3001);
});
