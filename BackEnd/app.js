const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

const app = express();

app.use(express.json());

//Connect to MongoDB database
mongoose
  .connect('mongodb+srv://luc:kp0zi5WQyeisvPHO@monvieuxgrimoir.7ivqkho.mongodb.net/')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS rules
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Credentials'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
