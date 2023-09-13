export default setTokenCookie = (req, res, next) => {
  if (res.locals.token) {
    res.cookie('token', res.locals.token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
  }

  return next();
};