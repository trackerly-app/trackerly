// Import modules
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
// Import database query model
import db from '../models/applicationModel.js';

const app = express();
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
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/github/callback', // The URL to which GitHub redirects after authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user with the given GitHub ID already exists in the database
        const result = await db.query('SELECT * FROM users WHERE githubId=$1', [
          profile.id,
        ]);
        if (result.rows.length === 0) {
          // If not, create a new user record with the GitHub ID and username
          await db.query(
            'INSERT INTO users (githubId, username) VALUES ($1, $2)',
            [profile.id, profile.username]
          );
        }
        done(null, profile); // Return the user profile
      } catch (err) {
        done(err); // Return any errors that occur
      }
    }
  )
);

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
    res.redirect('/dashboard'); // Redirect user to the dashboard
  }
);