const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body-parser

// Serve static files from React app
app.use(express.static(path.join(__dirname, './clientside/build')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Mongoose schema for the contact form
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

// Define API route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// Fallback to serve React app for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './clientside/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
