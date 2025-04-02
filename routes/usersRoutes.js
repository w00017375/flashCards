const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const userController = require('../controllers/userController');

router.get('/', authMiddleware, (req, res) => {
  const userData = userController.getUser(req.user.username);
  if (!userData) {
    return res.redirect('/401');
  }
  res.render('profile', { title: 'Profile', user: req.user, userData });
});

router.post('/update', authMiddleware, (req, res) => {
  try {
    const updatedUser = userController.updateUser(req.user.username, req.body);
    if (!updatedUser) {
      return res.render('profile', {
        title: 'Profile',
        user: req.user,
        userData: userController.getUser(req.user.username),
        error: 'Error updating profile. User not found.'
      });
    }
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: updatedUser.id, username: updatedUser.username},
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    return res.render('profile', {
      title: 'Profile',
      user: req.user,
      userData: userController.getUser(req.user.username),
      error: err.message || 'Error updating profile. Please try again.'
    });
  }
});

router.post('/delete', authMiddleware, (req, res) => {
  const success = userController.deleteUser(req.user.username);
  if (!success) {
    return res.render('profile', {
      title: 'Profile',
      user: req.user,
      userData: userController.getUserByUsername(req.user.username),
      error: 'Error deleting account. Please try again.'
    });
  }
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;