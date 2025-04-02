const fs = require('fs');
const path = require('path');

if (!global.flashcards_db) {
    global.flashcards_db = path.join(__dirname, '../data', 'flashcards.json');
  }
  
  const flashcards = require(global.flashcards_db);

const genRandId = (count) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < count; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const saveFlashcards = () => {
  fs.writeFileSync(global.flashcards_db, JSON.stringify(flashcards, null, 2));
};

const flashcardService = {
  get(req, res) {
    console.log('flashcardService.get called');
    return flashcards;
  },

  getByUser(req, res) {
    console.log('flashcardService: getByUser called');
    if (!req.user || !req.user.id) {
      console.log('flashcardService: No user ID found in req.user');
      return [];
    }
    const userId = req.user.id;
    console.log('flashcardService: Fetching flashcards for userId:', userId);
    const userFlashcards = flashcards.filter(card => card.userId === userId);
    console.log('flashcardService: User flashcards found:', userFlashcards);
    return userFlashcards;
  },

  getById(req, res) {
    console.log('flashcardService.getById called');
    const id = req.params.id;
    return flashcards.find(card => card.id === id);
  },

  create(req, res) {
    console.log('flashcardService.create called');
    const { front, back, language, topic } = req.body;
    const userId = req.user.id; 
    const newFlashcard = {
      id: genRandId(4),
      userId,
      language,
      topic,
      front,
      back: {
        translation: back.translation,
        pronunciation: back.pronunciation,
        example: back.example,
        partOfSpeech: back.partOfSpeech
      }
    };
    flashcards.push(newFlashcard);
    saveFlashcards();
    return newFlashcard;
  },

  update(req, res) {
    console.log('flashcardService.update called');
    const id = req.params.id;
    const index = flashcards.findIndex(card => card.id === id);
    if (index === -1) return null;

    const { front, back, language, topic } = req.body;
    flashcards[index] = {
      id: flashcards[index].id,
      userId: flashcards[index].userId,
      language: language || flashcards[index].language,
      topic: topic || flashcards[index].topic,
      front: front || flashcards[index].front,
      back: {
        translation: back.translation || flashcards[index].back.translation,
        pronunciation: back.pronunciation || flashcards[index].back.pronunciation,
        example: back.example || flashcards[index].back.example,
        partOfSpeech: back.partOfSpeech || flashcards[index].back.partOfSpeech
      }
    };
     saveFlashcards();
    return flashcards[index];
  },

  delete(req, res) {
    console.log('flashcardService.delete called');
    const id = req.params.id;
    const index = flashcards.findIndex(card => card.id === id);
    if (index === -1) return false;
    flashcards.splice(index, 1);
    saveFlashcards();
    return true;
  }
};

module.exports = flashcardService;