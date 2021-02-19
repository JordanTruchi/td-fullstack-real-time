const { checkAuthUtils } = require("~Utils/auth.js");

async function checkAuth (req, res, next) {
  try {
    const token = ((req.headers.authorization).split(' '))[1];
    const userLogged = await checkAuthUtils(token);
    res.locals.user = userLogged;
    next();
  } catch (e) {
    res.status(403).json(e);
  }
}

module.exports =  {
  checkAuth
}