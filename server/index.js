import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import db from './models/applicationModel.js';
import setTokenCookie from './controllers/cookie.controller.js'
import { generateToken, verifyToken } from './controllers/jwt.controller.js';
import { registerUser, verifyUser } from './controllers/user.controller.js';
import { addCompany,
         addApplication,
         getCompanies,
         updateCompany,
         deleteCompany,
         getApplications,
         updateApplication, 
         deleteApplication } from './controllers/track.controller.js';

config();
const PORT = 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', //
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// Import modules

// routes for future use:
// app.use('/users', userRouter);


// Initialize passport for authentication
// This will initialize passport.js
app.use(passport.initialize());
// initialize passport session 
app.use(passport.session());

// Configure passport to use Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      callbackURL: 'http://localhost:4000/auth/google/callback',// This will take you the Google OAuth login and if successful take you to the next line
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('this is the user profile: ', profile)
      try {
        // Check if the user with the given email already exists in the database
        const result = await db.query('SELECT * FROM users WHERE email=$1', [
          profile.emails[0].value,
        ]);
       
        if (result.rows.length === 0) {
          console.log('The profile username query is being executed')
          // If not, create a new user record with the Google ID and email
          await db.query(
            'INSERT INTO users (username, email) VALUES ($1, $2)',
            [profile.name, profile.emails[0].value]
          );
        }
        done(null, profile); // Return the user profile and invoke serialize user
      } catch (err) {
        done(err); // Return any errors that occur
      }
    }
  )
);

// Configure passport to use GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      callbackURL: 'http://localhost:4000/auth/github/callback', // The URL to which GitHub redirects after authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('this is the user profile: ', profile)
    
      try {
        // Check if the user with the given email already exists in the database
        const result = await db.query('SELECT * FROM users WHERE email=$1', [
          profile.url
        ]);
 
        if (result.rows.length === 0) {
          console.log('The profile username query is being executed')
          // If not, create a new user record with the Google ID and email
          await db.query(
            'INSERT INTO users (username, email) VALUES ($1, $2)',
            [profile.login, profile.url]
          );
        }

        done(null, profile); // Return the user profile
      } catch (err) {
        done(err); // Return any errors that occur
      }
    }
  )
);

//  Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user); // this will trigger app.get('auth/google/callback)
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Define routes for Google OAuth authentication flow
// This will direct your users to passport.use and check for their credentials
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
    res.redirect('http://localhost:3000/dashboard'); // Redirect user to the dashboard
  }
);

// Define routes for GitHub OAuth authentication flow
app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }), // Authenticate user after GitHub login
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || 'default_jwt_secret', // Generate JWT for authenticated user
      { expiresIn: '1h' }
    );
    res.cookie('token', token, { httpOnly: true }); // Set JWT as an HTTP-only cookie
    res.redirect('http://localhost:3000/dashboard'); // Redirect user to the dashboard
  }
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
  return res.status(200).json(res.locals.uid);
});

app.post('/login', verifyUser, generateToken, setTokenCookie, (req, res) => {
  return res.status(200).json(res.locals.uid);
});


app.get('/company/:user_id', verifyToken, getCompanies, (req, res) => {
  return res.status(200).json(res.locals.companies);
});
app.get('/company', verifyToken, getCompanies, (req, res) => {
  return res.status(200).json(res.locals.companies);
});

app.post('/company', verifyToken, addCompany, (req, res) => {
  return res.status(201).json(res.locals.result);
});

app.put('/company', verifyToken, updateCompany, (req, res) => {
  return res.status(200).json(res.locals.company)
});

app.delete('/company', verifyToken, deleteCompany, (req, res) => {
  return res.status(202).json(res.locals.company)
});



app.post('/application', verifyToken, addApplication, (req, res) => {
  return res.status(200).json(res.locals.result);
});

app.put('/application', verifyToken, updateApplication, (req, res) => {
  return res.status(200).json(res.locals.result);
});

app.delete('/application', verifyToken, deleteApplication, (req, res) => {
  return res.status(202).json(res.locals.result);
});
app.post('/allapps', verifyToken, getApplications, (req, res) => {
  return res.status(200).json(res.locals.result);
});
app.get('/allapps/:user_id', verifyToken, getApplications, (req, res) => {
  return res.status(200).json(res.locals.result);
});

app.get('/api/healthcheck', (req, res) => res.sendStatus(200));



// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/http://localhost:3000/signup');
// });

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

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
