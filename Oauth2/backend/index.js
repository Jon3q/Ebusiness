require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const app = express();
const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');


app.use('/auth', oauthRoutes);


app.use('/api/auth', authRoutes);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: 'sekretnyklucz', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Połączenie z Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Endpoint testowy
app.get('/', (req, res) => res.send('Backend działa!'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
