/**
 * @file Routes initialisation
 */

const express = require('express'),
      { Router } = express,
      cors = require('cors'),
      corsOptions = require('~Conf/http/cors'),
      user = require('~Routes/user'),
      post = require('~Routes/post');

const { BASE_API_URL } = process.env;

const staticRoutes = new Router();
staticRoutes.use('/assets', express.static('public'));

/**
 * REST API routes
 */
const apiRoutes = new Router();
apiRoutes.use('/api/v1', cors(corsOptions),
                         express.json(),
                         user,
                         post);

const baseRoute = new Router();
baseRoute.use(BASE_API_URL, apiRoutes, staticRoutes);

module.exports = baseRoute;