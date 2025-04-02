const flashcardService = require('../services/flashcards');

exports.getAllFlashcards = (req, res, all = false) => {
  console.log('flashcardController.getAllFlashcards called');
  const allFlashcards = flashcardService.get(req, res);
  if (all) return allFlashcards;

  if (!req.user || !req.user.id) {
    return res.redirect('/login');
  }

  const userId = req.user.id;
  const userFlashcards = allFlashcards.filter(card => card.userId === userId);
  res.render('flashcards', {
    title: 'Flashcards',
    user: req.user,
    flashcards: userFlashcards
  });
};

exports.getCardsByUser = (req, res) => {
  console.log('flashcardController: getCardsByUser called');
  const userFlashcards = flashcardService.getByUser(req, res);
  if (!userFlashcards || userFlashcards.length === 0) {
    console.log('flashcardController: No flashcards found for user');
    return res.render('flashcards', {
      title: 'Flashcards',
      user: req.user,
      flashcards: [],
      message: 'No flashcards found for this user.'
    });
  }

  console.log('flashcardController: User flashcards retrieved:', userFlashcards);
  res.render('flashcards', {
    title: 'Flashcards',
    user: req.user,
    flashcards: userFlashcards
  });
};

exports.getFlashcardById = (req, res) => {
  console.log('flashcardController.getFlashcardById called');
  const flashcard = flashcardService.getById(req, res);
  if (!flashcard) {
     return null;
  }
   return flashcard;
};

exports.createFlashcard = async (req, res) => {
  console.log('flashcardController.createFlashcard called');
  
  try {
    await flashcardService.create(req, res);
    res.redirect('/flashcards');
  } catch (err) {
    console.error('Error creating flashcard:', err);
    res.status(500).send('Error creating flashcard');
  }
};


exports.updateFlashcard = (req, res, justReturn = false) => {
  console.log('flashcardController.updateFlashcard called');
  const updatedFlashcard = flashcardService.update(req, res);
  if (!updatedFlashcard) {
    if (justReturn) return null;
    return res.status(404).send('Flashcard not found');
  }
  if (justReturn) return updatedFlashcard;
  res.redirect('/flashcards');
};

exports.deleteFlashcard = (req, res, justReturn = false) => {
  console.log('flashcardController.deleteFlashcard called');
  const success = flashcardService.delete(req, res);
  if (!success) {
    if (justReturn) return false;
    return res.status(404).send('Flashcard not found');
  }
  if (justReturn) return true;
  res.redirect('/flashcards');
};