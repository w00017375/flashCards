const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const flashcardController = require('../controllers/flashcardController');

router.get('/', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: GET /flashcards route called');
  flashcardController.getCardsByUser(req, res);
});

router.get('/create', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: GET /flashcards/create route called');
  res.render('addFlashcard', { title: 'Add Flashcard', user: req.user, error: null });
});

router.post('/create', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: POST /flashcards/create route called');
  const newFlashcard = flashcardController.createFlashcard(req, res, true);
  if (!newFlashcard) {
    return res.render('addFlashcard', {
      title: 'Add Flashcard',
      user: req.user,
      error: 'Error adding flashcard. Please try again.'
    });
  }
  res.redirect('/flashcards');
});

router.get('/update/:id', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: GET /flashcards/update/:id route called');
  const flashcard = flashcardController.getFlashcardById(req, res);
  if (!flashcard) {
    return res.status(404).send('Flashcard not found');
  }
  res.render('editFlashcard', { title: 'Edit Flashcard', flashcard, user: req.user });
});

router.post('/update/:id', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: POST /flashcards/update/:id route called');
  const updatedFlashcard = flashcardController.updateFlashcard(req, res, true);
  if (!updatedFlashcard) {
    return res.status(404).send('Flashcard not found');
  }
  res.redirect('/flashcards');
});

router.post('/delete/:id', authMiddleware, (req, res) => {
  console.log('flashcardRoutes: POST /flashcards/delete/:id route called');
  const success = flashcardController.deleteFlashcard(req, res, true);
  if (!success) {
    return res.status(404).send('Flashcard not found');
  }
  res.redirect('/flashcards');
});

router.get('/:id', (req, res) => {
  console.log('flashcardRoutes: GET /flashcards/:id route called');
  flashcardController.getFlashcardById(req, res);
});

module.exports = router;