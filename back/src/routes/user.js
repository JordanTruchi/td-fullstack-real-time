const express = require('express');
const routes = express.Router();
const user = require('~Controllers/user.js');

routes.post('/login', user.login);
routes.post('/register', user.register);
routes.get('/auth', user.checkAuth);

module.exports = routes;