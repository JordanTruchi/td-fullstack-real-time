const express = require('express');
const routes = express.Router();
const post = require('~Controllers/post.js');
const { checkAuth } = require('~Middlewares/auth.js');



routes.get('/post', checkAuth, post.list);
routes.post('/post', checkAuth, post.create);
routes.put('/post/:id', checkAuth, post.like);

module.exports = routes;