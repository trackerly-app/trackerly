import jwt from 'jwt';
import bcrypt from 'bcrypt';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import db from '../models/applicationModel.js';

export const registerUser = async () => {
  const { email, username, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(userQuery, [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });

    //  Save the user to the database
    const queryString = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    await db.query(queryString,[username, email, hashedPassword]);

    res.locals.register = { message: 'Registration success.' };
    return next(res.locals.register);
  } catch (err) {
    return next({
      log: `[userCtrl - registerUser] There was a problem signing up`,
      status: 500,
      message: 'Failed to register user.'
    });
  }
};

export const verifyUser = async () => {
  const { email, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const data = await db.query(queryString,[email]);

    if(data.rows.length === 0) {
      throw new Error('[userCtrl - verifyUser] Unable to verify user credentials');
    }

    const { password: hashedPass, id } = data.rows[0];
    const match = await bcrypt.compare(password, hashedPass);

    if (match) {
      const token = jwt.sign({ email: email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
      res.json({ token, id: id });
    } else {

    }
  } catch (err) {

  }
};