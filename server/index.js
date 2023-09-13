import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// Import server controllers
import setTokenCookie from './controllers/cookie.controller.js'
import { generateToken } from './controllers/jwt.controller.js';
import { registerUser, verifyUser } from './controllers/user.controller.js';
import { addCompany, addApplication } from './controllers/track.controller.js';

config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', //
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

/**
 * Ask @Anatoliy if this route is even necessary.
 */
// app.get('/', (req,res) => {
  // try {
  //   const userQuery = 'SELECT * FROM users;';
  // const result = await db.query(userQuery);
  // console.log(result.rows);
  // return res.status(200).json(result.rows);
  // }
  // catch(err) {
  //   console.log("Error:", err);
  //   return res.status(400).json({ message: 'An error occurred while fetching users.' });
  // }
// })

app.post('/signup', registerUser, generateToken, setTokenCookie, (req,res) => {
  return res.status(200);
});

app.post('/login', verifyUser, generateToken, setTokenCookie, (req, res) => {
  return res.status(200).json(res.locals.id);
});

app.post('/company', addCompany, (req, res) => {
  return res.status(200).json(res.locals.result);
});

app.post('/application', addApplication, (req, res) => {
  return res.status(200).json(res.locals.result);
});

app.get('/api/healthcheck', (req, res) => res.sendStatus(200));

// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
  res.status(404).send('This is not the page you\'re looking for...')
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(4000, () => console.log('App listening on port 4000...'));