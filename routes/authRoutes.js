const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const flashcardController = require('../controllers/flashcardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    console.log('authRoutes: GET / route called');
    const flashcards = await flashcardController.getAllFlashcards(req, res, true);
    console.log('authRoutes: Flashcards retrieved for home:', flashcards);
    res.render('home', { title: 'FlashCards - Language Learning', user: req.user, flashcards: flashcards });
  } catch (err) {
    console.error('Error in GET / route:', err.message);
    res.status(500).render('error', { message: 'Internal server error', user: req.user });
  }
});

router.get('/register', (req, res) => {
  console.log('authRoutes: GET /register route called');
  if (req.user) {
    console.log('authRoutes: User already logged in, redirecting to /flashcards');
    return res.redirect('/flashcards');
  }
  res.render('register', { title: 'Register', user: req.user, error: null });
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
  res.render('login', { title: 'Log In', user: req.user, error: null });
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

router.get('/profile', authMiddleware, (req, res) => {
  console.log('authRoutes: GET /profile route called');
  res.render('profile', { title: 'Profile', user: req.user });
});

module.exports = router;