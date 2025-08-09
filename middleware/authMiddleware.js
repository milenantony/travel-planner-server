// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if there is no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If there is a token, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. If the token is valid, add the user's info to the request object
    req.user = decoded.user;
    next(); // Pass control to the next function (the actual route handler)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};