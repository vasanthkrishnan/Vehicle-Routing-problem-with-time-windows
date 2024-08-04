const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

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

// Define a Schema and Model
const contactSchema = new mongoose.Schema({
  name: String,
  c_name: String,
  m_number: String,
  email: String,
  subject: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.post('/contact', async (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    c_name: req.body.c_name,
    m_number: req.body.m_number,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  });

  try {
    await newContact.save();
    res.status(200).send('Contact information saved successfully.');
  } catch (err) {
    res.status(500).send('Error saving contact information.');
  }
});

// Start the server
const port = process.env.PORT || 3060;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
