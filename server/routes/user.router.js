import express from 'express';
import * as users from '../controllers/user.controller';
import * as jwt from '../controllers/jwt.controller';
import * as cookie from '../controllers/cookie.controller';

const router = express.Router();

router.get('/login', users.verifyUser, jwt.generateToken, cookie.setTokenCookie, (_, res) => {
  return res.status(200).json(res.locals.uid)
})

module.exports = router;