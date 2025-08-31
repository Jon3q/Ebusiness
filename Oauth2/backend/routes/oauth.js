const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../config/passport');

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // redirect z tokenem do React
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${req.user.serverToken}`);
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${req.user.serverToken}`);
  }
);

module.exports = router;
