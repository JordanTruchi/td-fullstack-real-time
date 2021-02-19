const User = require('~Models/user.js');
firebase = require('firebase');
const { checkAuthUtils } = require("~Utils/auth.js");

async function login(req, res) {
  try {

    const { password, mail } = req.body;
    if (!password || !mail) throw { code: 400, message: 'Credentials missing' };
    
    const query = User.where({ mail: mail });
    const user = await query.findOne();
    if (!user) throw { code: 400, message: 'BAD Creadentials' };
    const result = {
      status: 'OK',
      code: 200,
      message: 'User login',
      result: user
    }

    res.status(200).json(result);

  } catch(error) {

    const code = typeof error.code === "number" ? error.code : 500,
          message = error.message || error;
    res.status(code).json(message);
  }
}

async function register (req, res) {
  try {
    const { username, mail, password } = req.body;
    if (!username || !mail || !password) throw { code: 400, message: 'Data missing' };

    const query = User.where({ mail: mail });
    const user = await query.findOne();
    if (user) throw { code: 400, message: 'Mail already used' };
    await User.create({ username, mail });
    await firebase.auth().createUserWithEmailAndPassword(mail, password);
    const result = {
      status: 'OK',
      code: 201,
      message: 'User create',
      result: 'OK'
    }

    res.status(201).json(result);

  } catch (error) {
    const code = typeof error.code === "number" ? error.code : 500,
          message = error.message || error;
    res.status(code).json(message);
  }
}

async function checkAuth (req, res, next) {
  try {
    const token = ((req.headers.authorization).split(' '))[1];
    const userLogged = await checkAuthUtils(token);
    if (userLogged.status == "KO") throw userLogged;
    
    const result = {
      status: 'OK',
      code: 201,
      message: 'User create',
      result: userLogged
    }

    res.status(200).json(result);
  } catch (e) {
    res.status(403).json(e);
  }
}

module.exports = {
  login,
  register,
  checkAuth
}