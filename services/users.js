const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

if (!global.users_db) {
  global.users_db = path.join(__dirname, '../data', 'users.json');
}

let users = [];
try {
  const data = fs.readFileSync(global.users_db, 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.error('Error loading users.json:', err.message);
  users = [];
  fs.writeFileSync(global.users_db, JSON.stringify(users, null, 2));
}

const userService = {
  get(req, res) {
    console.log('userService: get called');
    return users;
  },

  getById(req, res) {
    console.log('userService: getById called');
    const id = req.params.id;
    return users.find(user => user.id === id);
  },

  findByUsername(username) {
    console.log('userService: findByUsername called for username:', username);
    return users.find(user => user.username === username);
  },

  create(req, res) {
    console.log('userService: create called');
    const generated_id = genRandId(4);
    const body = req.body;
    const user = {
      id: generated_id,
      username: body.username,
      password: body.password
    };

    users.push(user);
    this.saveUsers(users);
    console.log('userService: User created:', user);
    return user;
  },

  update(req, res) {
    console.log('userService: update called');
    const id = req.params.id;
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      console.log('userService: User not found');
      return null;
    }

    users[index] = {
      id: users[index].id,
      username: req.body.username || users[index].username,
      password: req.body.password || users[index].password
    };

    this.saveUsers(users);
    console.log('userService: User updated:', users[index]);
    return users[index];
  },

  delete(req, res) {
    console.log('userService: delete called');
    const id = req.params.id;
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
      console.log('userService: User not found');
      return false;
    }

    users.splice(index, 1);
    saveUsers(users); 
    console.log('userService: User deleted');
    return true;
  },

  saveUsers (users)  {
    console.log("Save Users is called")
    fs.writeFileSync(global.users_db, JSON.stringify(users, null, 2));
  },
};

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const genRandId = (length, charSet = DEFAULT_CHARACTERS) => {
  if (typeof length !== 'number' || length <= 0) {
    throw new Error('Length must be a positive number');
  }
  if (typeof charSet !== 'string' || charSet.length === 0) {
    throw new Error('Character set must be a non-empty string');
  }
  return Array.from(
    { length },
    () => charSet.charAt(Math.floor(Math.random() * charSet.length))
  ).join('');
};

module.exports = userService;