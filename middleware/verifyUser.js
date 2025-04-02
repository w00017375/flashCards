const jwt = require('jsonwebtoken');

const checkUser = (req, res, next) => {
  console.log(`checkUser called for path: ${req.originalUrl}`);
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.user = null;
      } else {
        req.user = decoded;
      }
      next();
    });
  } else {
    req.user = null;
    next();
  }
};

module.exports = checkUser;