import log from '../logging/log.js';
const setTokenCookie = (req, res, next) => {
  log.info('[cookieCtrl - setToken] Setting token cookie...')
  log.info('This is the token: ' + res.locals.token)
  if (res.locals.token) {
    res.cookie('token', res.locals.token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
  }

  return next();
};

export default setTokenCookie;