const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log(`authMiddleware called for path: ${req.originalUrl}`);
  const token = req.cookies.token;
  if (!token) {
    console.log('authMiddleware: No token, redirecting to /login');
    return res.redirect('/401');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('authMiddleware: Token invalid, redirecting to /401');
      return res.redirect('/401');
    }
    req.user = decoded;
    console.log('authMiddleware: Token verified, req.user set:', req.user);
    next();
  });
};

module.exports = authMiddleware;