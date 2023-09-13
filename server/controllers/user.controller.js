// Import modules
import bcrypt from 'bcrypt';
// Import controllers
import log from '../logging/log.js';
import db from '../models/applicationModel.js';

// Registers new user in database - POST requeset to '/signup'
export const registerUser = async (req, res, next) => {
  log.info('[userCtrl - registerUser] Attempting to register user in database...');
  // Sanitize information in request body
  const { email, username, password } = req.body;
  try {
    // Query string for users matching email on request body
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    // Search database for email from sanitized and parameterized request body
    const user = await db.query(userQuery, [email]);

    // If the email already exists in the database, throw an error
    if (user.rows.length > 0) {
      throw new Error('Sorry, something went wrong. Please, try again!');
    }

    // Creates a hashed password with a salt factor of 10 using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    
    /**
     * Test, then ask @Anatoliy if this route is still necessary.
     * Cookies are now handled in separate middleware.
     * 
     * res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
     */

    // Query string for inserting users into database
    const queryString = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    // Create new user in database from sanitized and parameterized request body
    const result = await db.query(queryString,[username, email, hashedPassword]);

    // Assign message and created user row from query to res.locals
    res.locals.result = {
      message: 'User added successfully',
      user: result.rows[0],
    };

    log.info('[userCtrl - registerUser] User successfully registered in database.');
    // Proceed to next middleware
    return next();
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem signing up',
      status: err.status,
      message: err.message
    });
  }
};

// Verifies user from database - POST requeset to '/login'
export const verifyUser = async (req, res, next) => {
  log.info('[userCtrl - verifyUser] Attempting to verify user from database...');
  // Sanitize information in request body
  const { email, password } = req.body;
  try {
    // Query string for users matching email on request body
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    // Search database for user from sanitized and parameterized request body
    const user = await db.query(userQuery, [email]);

    // If the email does NOT exist in the database, throw an error
    if (user.rows.length === 0) {
      throw new Error('Sorry, something went wrong. Please, try again!');
    }

    // Destructure password as hashedPass and id as uid from found user
    const { password: hashedPass, id: uid } = user.rows[0];
    // Compare plaintext password with hashed password from database using bcrypt
    const match = await bcrypt.compare(password, hashedPass);

    // If the password does NOT match, throw an error
    if (!match) {
      throw new Error('Sorry, something went wrong. Please, try again!');
    }

    // Assign uid to res.locals
    res.locals.uid = uid;

    log.info('[userCtrl - registerUser] User successfully verified from database.');
    // Proceed to next middleware
    return next();
    
  } catch (err) {
    // Return error information to global error handler
    return next({
      log: 'There was a problem verifying user',
      status: err.status,
      message: err.message
    });
  }
};