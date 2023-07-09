const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Google Auth
// @route GET /auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

// @desc callback with Google Auth
// @route GET /auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

router.get('/microsoft',
  passport.authenticate('microsoft', {
    prompt: 'select_account',
  }));

router.get('/microsoft/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
// @desc logout
// @route GET /auth/logout
// Example code
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});


module.exports = router;