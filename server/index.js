import cors from 'cors';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import db from './models/applicationModel.js'; // Database connection and queries
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

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

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());



// Configure passport to use Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:4000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user with the given Google ID already exists in the database
        const result = await db.query('SELECT * FROM users WHERE googleId=$1', [
          profile.id,
        ]);
        if (result.rows.length === 0) {
          // If not, create a new user record with the Google ID and email
          await db.query(
            'INSERT INTO users (googleId, email) VALUES ($1, $2)',
            [profile.id, profile.emails[0].value]
          );
        }
        done(null, profile); // Return the user profile
      } catch (err) {
        done(err); // Return any errors that occur
      }
    }
  )
);

// Configure passport to use GitHub OAuth strategy
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID || '',
//       clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
//       callbackURL: 'http://localhost:3000/auth/github/callback', // The URL to which GitHub redirects after authentication
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if the user with the given GitHub ID already exists in the database
//         const result = await db.query('SELECT * FROM users WHERE githubId=$1', [
//           profile.id,
//         ]);
//         if (result.rows.length === 0) {
//           // If not, create a new user record with the GitHub ID and username
//           await db.query(
//             'INSERT INTO users (githubId, username) VALUES ($1, $2)',
//             [profile.id, profile.username]
//           );
//         }
//         done(null, profile); // Return the user profile
//       } catch (err) {
//         done(err); // Return any errors that occur
//       }
//     }
//   )
// // );

// Specify how to serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define routes for Google OAuth authentication flow
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Request access to user's profile and email
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }), // Authenticate user after Google login
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || 'default_jwt_secret', // Generate JWT for authenticated user
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true }); // Set JWT as an HTTP-only cookie
    res.redirect('/dashboard'); // Redirect user to the dashboard
  }
);

// Define routes for GitHub OAuth authentication flow
// app.get('/auth/github', passport.authenticate('github'));

// app.get(
//   '/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }), // Authenticate user after GitHub login
//   (req, res) => {
//     const user = req.user;
//     const token = jwt.sign(
//       user,
//       process.env.JWT_SECRET || 'default_jwt_secret', // Generate JWT for authenticated user
//       { expiresIn: '1h' }
//     );
//     res.cookie('token', token, { httpOnly: true }); // Set JWT as an HTTP-only cookie
//     res.redirect('/dashboard'); // Redirect user to the dashboard
//   }
// );
// Signup

app.get('/', async (req,res) => {
  try {
    const userQuery = 'SELECT * FROM users;';
  const result = await db.query(userQuery);
  console.log(result.rows);
  return res.status(200).json(result.rows);
  }
  catch(err) {
    console.log("Error:", err);
    return res.status(400).json({ message: 'An error occurred while fetching users.' });
  }

})

app.post('/signup', async (req,res) => {
  try {
    const { email, username, password } = req.body;
    console.log(email,username, password);
    const userQuery = 'SELECT * FROM users WHERE email=$1';
    const result = await db.query(userQuery, [email]);
    console.log(result.rows);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    res.cookie('userEmail', email, { maxAge: 3600000, httpOnly: true });
    //  Save the user to the database
    const queryString = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
    await db.query(queryString,[username, email, hashedPassword]);
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
  console.log(data.rows);
  if(data.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const { password: hashedPass, id } = data.rows[0];
  if (await bcrypt.compare(password, hashedPass)) {
    const token = jwt.sign({ email: email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' })
    res.json({ token, id: id })
  } else {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  }

catch(err) {
 return  res.status(400).json({log: 'Error in login',
    message: { err: 'login error' },})
}
});

app.post('/company', async (req, res) => {
  try {
    const {name, website, user_id, notes} = req.body;
    console.log(name, website, user_id, notes);
    // Check if the company exists
    let queryString = `SELECT * FROM companies WHERE user_id=$1 and name=$2`;
    const data = await db.query(queryString,[user_id, name]);
    console.log('rows',data.rows);
    if(data.rows.length !== 0)
      return res.status(400).json({ message: "Company exists already" });

    //Insert new company
    console.log('inserting');
    queryString = `INSERT INTO companies (name, website, user_id, notes) VALUES ($1, $2, $3, $4)`;
    await db.query(queryString,[name, website, user_id, notes]);
    return res.status(200).json({ message: "Company added" });
  }

catch(err) {
  return res.status(400).json({log: 'Error adding application',
    message: { err: 'add application error' },})
}
});

app.post('/application', async (req, res) => {
  try {
    const {user_id, company_id, position, salary, status, notes, application_url} = req.body;
    console.log(user_id, company_id, position, salary, status, notes, application_url);
    // Fetch the user from the database
    const queryString = `INSERT INTO applications (user_id, company_id, position, salary, status, notes, application_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const data = await db.query(queryString,[user_id, company_id, position, salary, status, notes, application_url]);
    console.log(data.rows);
    return res.status(200).json({ message: "Application added" });
  }

catch(err) {
  return res.status(400).json({log: 'Error adding application',
    message: { err: 'add application error' },})
}
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));


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

app.listen(4000, () => console.log('App listening on port 4000!'));
