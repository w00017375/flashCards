const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');
const verifyUser = require('./middleware/verifyUser');

app.use(cookieParser());
app.use(verifyUser);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
const routes = require('./routes/index');
const flashcardRoutes = require('./routes/flashcardRoutes');
const usersRoutes = require('./routes/usersRoutes');
app.use('/', routes);
app.use('/profile', usersRoutes);
app.use('/flashcards', flashcardRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});