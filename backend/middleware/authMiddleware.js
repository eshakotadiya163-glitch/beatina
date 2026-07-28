import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies?.jwt;

  // Fallback to Bearer token in header for mobile/API clients if needed
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

// Vendor middleware
const vendor = (req, res, next) => {
  if (req.user && (req.user.isVendor || req.user.isAdmin)) {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as a vendor'));
  }
};

// Role-based middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && (roles.includes(req.user.role) || req.user.role === 'superadmin')) {
      next();
    } else {
      res.status(403);
      next(new Error('Access denied: Insufficient role permissions'));
    }
  };
};

// Permission-based middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user && (req.user.role === 'superadmin' || req.user.permissions?.includes(permission))) {
      next();
    } else {
      res.status(403);
      next(new Error(`Access denied: Requires ${permission} permission`));
    }
  };
};

export { protect, admin, vendor, requireRole, requirePermission };
