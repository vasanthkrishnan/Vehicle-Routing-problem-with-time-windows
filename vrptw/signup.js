const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3050;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/Database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  cname: String,
  name: String,
  email: String,
  mobno: String,
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/signup', async (req, res) => {
  const { cname, name, email, mobno, username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username not available' });
    }

    // If username is available, save the new user
    const newUser = new User({ cname, name, email, mobno, username, password });
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
