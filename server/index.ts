import cors from 'cors'
import express, {Express} from 'express'
import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from './models/applicationModel'
import cookieParser from 'cookie-parser'
import { GlobalError, SignupRequestBody } from './types'
import session from 'express-session'

const app: Express = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Signup
app.post('/signup', async (req: any, res: any) => {
  try {
    const { email, username, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
    await res.json({ message: 'User registered' });
    //  Save the user to the database
    const queryString = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    await db.query(queryString,[username, email, password]);
    return res.status(200).json({ message: 'User registered' });
  }

  catch (err) {
    return res.status(400).json({log: 'Error in signup',
    message: { err: 'singup error' },})
  }

  });

app.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body
  // Fetch the user from the database
  const queryString = `SELECT * FROM users WHERE email = $1`
  const data = await db.query(queryString,[email]);
  if(data.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const { password: hashedPass, id } = data.rows[0];
  if (await bcrypt.compare(password, hashedPass)) {
    const token = jwt.sign({ email: email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' })
    res.json({ token })
  } else {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  res.locals.loginInfo = {id: id};
  return res.status(200).json(res.locals.loginInfo);
  }

catch(err) {
 return  res.status(400).json({log: 'Error in login',
    message: { err: 'login error' },})
}
});

app.post('/application', async (req, res) => {
  try {
    const {user_id, company_id, position, salary, status, notes, application_url} = req.body
    // Fetch the user from the database
    const queryString = `INSERT INTO applications (user_id, company_id, position, salary, status, notes, application_url)
    VALUES ('$1, $2, $3, $4, $5, $6, $7')`;
    const data = await db.query(queryString,[user_id, company_id, position, salary, status, notes, application_url]);
    return res.status(200);
  }

catch(err) {
  return res.status(400).json({log: 'Error adding application',
    message: { err: 'add application error' },})
}

});

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));


app.use((err, req, res, next) => {
  const defaultErr: GlobalError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(4000, () => console.log('App listening on port 4000!'));
