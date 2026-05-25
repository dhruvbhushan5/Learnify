const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey12345!';

// Middleware to authenticate user from cookie
const authenticateUser = async (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;
  
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      // Clear invalid cookie
      res.clearCookie('token');
      req.user = null;
      res.locals.user = null;
    } else {
      req.user = user;
      res.locals.user = user;
    }
  } catch (err) {
    console.error('JWT Authentication Error:', err.message);
    res.clearCookie('token');
    req.user = null;
    res.locals.user = null;
  }
  
  next();
};

// Middleware to require authentication (redirects to login)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

// Middleware to require specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }
    if (req.user.role !== role) {
      return res.status(403).send('Forbidden: Access is restricted to ' + role + 's only.');
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  requireAuth,
  requireRole
};
