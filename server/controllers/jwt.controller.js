// Import modules
import jwt from 'jsonwebtoken';
import log from '../logging/log.js';

// Generates new JWT token for signed in users
export const generateToken = async (req, res, next) => {
  log.info('[jwtCtrl - generateToken] Attempting to generate user JWT token...');
  try {
    const { email } = req.body;
    // Sign a JWT token with the user's email that expires in 1 hour
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Assign the JWT token to res.locals
    res.locals.token = token;
    
    log.info('[jwtCtrl - generateToken] Successfully generated user JWT token.');
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'Error generating JWT token',
      status: err.status,
      message: err.message,
    });
  }
};

// Verifies JWT token for authentication
export const verifyToken = (req, res, next) => {
  return next();
    try {
      // Get the token from request cookies
      const token = req.cookies.token;
  
      // If no token is provided, return a 403 (Forbidden) status
      if (!token) {
        return res.status(403).send({ message: 'No token provided.' });
      }
  
      // Verify the token using your secret key
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          // If the verification fails, return a 500 (Internal Server Error) status
          return res.status(500).send({ message: 'Failed to authenticate token.' });
        }
  
        // If the verification succeeds, set req.userId to the ID in the token
        req.userId = decoded.id;
  
        // Proceed to next middleware
        return next();
      });
    } catch (err) {
      // Return error information to global error handler
      return next({
        log: 'Error generating JWT token',
        status: err.status,
        message: err.message,
      });
    }
  };