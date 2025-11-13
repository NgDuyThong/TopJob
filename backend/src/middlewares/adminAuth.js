import jwt from "jsonwebtoken";
import Account from "../models/Account.js";

/**
 * Middleware to verify that the user is authenticated and has admin role
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        message: "Unauthorized - No token provided" 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database to verify admin role
    const account = await Account.findById(decoded.id);
    
    if (!account) {
      return res.status(401).json({ 
        status: 'error',
        message: "Unauthorized - Account not found" 
      });
    }

    // Check if user is admin
    if (account.type !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: "Forbidden - Admin access required" 
      });
    }

    // Check if account is active
    if (account.status !== 'active') {
      return res.status(403).json({ 
        status: 'error',
        message: "Forbidden - Account is not active" 
      });
    }

    // Attach user info to request
    req.user = {
      id: account._id,
      username: account.username,
      type: account.type
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        status: 'error',
        message: "Forbidden - Invalid token" 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        status: 'error',
        message: "Forbidden - Token expired" 
      });
    }
    
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: "Internal server error" 
    });
  }
};
