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
      log: '[userCtrl - registerUser] There was a problem signing up',
      status: err.status,
      message: err.message
    });
  }
};

export const verifyUser = async () => {
  const { email, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const data = await db.query(queryString, [email]);

    if (data.rows.length === 0) {
      throw new Error('[userCtrl - verifyUser] Unable to verify user credentials');
    }

    const { password: hashedPass, id } = data.rows[0];
    const match = await bcrypt.compare(password, hashedPass);

    if (match) {
      const token = jwt.sign({ email: email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
      res.locals.match = { token, id: id };

      return next(res.locals.match);
    } else {
      throw new Error('[userCtrl - verifyUser] Unable to verify user credentials');
    }
  } catch (err) {
    return next({
      log: '[userCtrl - verifyUser] There was a problem verifying user',
      status: err.status,
      message: err.message
    });
  }
};

export const addCompany = async () => {
  const {name, website, user_id, notes} = req.body;
  try {
    const query = `SELECT * FROM companies WHERE user_id=$1 and name=$2`;
    const data = await db.query(queryString,[user_id, name]);

    if(data.rows.length) {
      throw new Error('Company already exists')
    }

    //Insert new company
    queryString = `INSERT INTO companies (name, website, user_id, notes) VALUES ($1, $2, $3, $4)`;
    await db.query(queryString, [name, website, user_id, notes]);

    return res.status(200).json({ message: "Company added" });
  } catch (err) {
    return next({
      log: '[userCtrl - addCompany] There was a problem adding company',
      status: err.status,
      message: err.message
    });
  }
};