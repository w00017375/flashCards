const userService = require('../services/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
  console.log('userController: getAllUsers called');

  const users = userService.get(req, res);
  res.json(users);
};

exports.getUserById = (req, res) => {
  console.log('userController: getUserById called');
  const user = userService.getById(req, res);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  try {
    console.log('userController.createUser called');
    const { username, password } = req.body;
    console.log('userController: Registering user with username:', username);
    const existingUser = userService.findByUsername(username);
    if (existingUser) {
      console.log('userController: Username already exists:', username);
      return res.render('register', {
        title: 'Register',
        user: req.user,
        error: 'Username already exists. <a href="/register">Try again</a>'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('userController: Password hashed');

    const newUser = userService.create(
      { body: { username, password: hashedPassword } },
      res
    );
    console.log('userController: New user created:', newUser);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log('userController: Token set, redirecting to /flashcards');
    res.redirect('/flashcards');
  } catch (err) {
    console.error('userController: Error in createUser:', err.message);
    res.render('register', {
      title: 'Register',
      user: req.user,
      error: `Error registering user: ${err.message}. <a href="/register">Try again</a>`
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log('userController.loginUser called');
    const { username, password } = req.body;
    console.log('userController: Logging in user with username:', username);
    const user = userService.findByUsername(username);
    if (!user) {
      console.log('userController: User not found:', username);
      return res.render('login', {
        title: 'Log In',
        user: req.user,
        error: 'Invalid username or password. <a href="/login">Try again</a>'
      });
    }

    const passwordSame = await bcrypt.compare(password, user.password);
    if (!passwordSame) {
      console.log('userController: Password does not match for user:', username);
      return res.render('login', {
        title: 'Log In',
        user: req.user,
        error: 'Incorrect password. <a href="/login">Try again</a>'
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log('userController: Token set, redirecting to /flashcards');
    res.redirect('/flashcards');
  } catch (err) {
    console.error('userController: Error in loginUser:', err.message);
    res.render('login', {
      title: 'Log In',
      user: req.user,
      error: `Error logging in: ${err.message}. <a href="/login">Try again</a>`
    });
  }
};

exports.getUser = (username) => {
  console.log('userController: getUserByUsername called for username:', username);
  const users = userService.get();
  return users.find(user => user.username === username);
};

exports.updateUser = (username, updatedData) => {
  console.log('userController: updateUserByUsername called for username:', username);
  const users = userService.get();
  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex === -1) return null;

  const existingUser = users[userIndex];
  users[userIndex] = {
    id: existingUser.id,
    username: updatedData.username || existingUser.username,
    password: existingUser.password
  };
  userService.saveUsers(users);
  console.log('userController: User updated:', users[userIndex]);
  return users[userIndex];
};

exports.deleteUser = (username) => {
  console.log('userController: deleteUserByUsername called for username:', username);
  const users = userService.get();
  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex === -1) return false;
  users.splice(userIndex, 1); // Fixed: Changed 'index' to 'userIndex'
  userService.saveUsers(users);
  console.log('userController: User deleted');
  return true;
};