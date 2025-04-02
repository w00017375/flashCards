const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const flashcardController = require('../controllers/flashcardController');

router.get('/', (req, res) => {
  console.log('authRoutes: GET / route called');
  const flashcards = flashcardController.getAllFlashcards(req, res, true);
  console.log('authRoutes: Flashcards retrieved for home:', flashcards);
  res.render('home', { title: 'FlashCards - Language Learning', user: req.user, flashcards });
});

router.get('/register', (req, res) => {
  console.log('authRoutes: GET /register route called');
  if (req.user) {
    console.log('authRoutes: User already logged in, redirecting to /flashcards');
    return res.redirect('/flashcards');
  }
  res.render('register', { title: 'Register', user: req.user });
});

router.post('/register', (req, res) => {
  console.log('authRoutes: POST /register route called');
  userController.createUser(req, res);
});

router.get('/login', (req, res) => {
  console.log('authRoutes: GET /login route called');
  if (req.user) {
    console.log('authRoutes: User already logged in, redirecting to /flashcards');
    return res.redirect('/flashcards');
  }
  res.render('login', { title: 'Login', user: req.user });
});

router.post('/login', (req, res) => {
  console.log('authRoutes: POST /login route called');
  userController.loginUser(req, res);
});

router.get('/401', (req, res) => {
  console.log('authRoutes: GET /401 route called');
  res.render('401', { title: 'Unauthorized', user: req.user });
});

router.get('/logout', (req, res) => {
  console.log('authRoutes: GET /logout route called');
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;