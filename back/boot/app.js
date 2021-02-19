/**
 * @file App initialization
 */


// native module
const express = require('express'),
      fs = require('fs'),
      app = express(),
      helmet = require('helmet');
// load routes
const routes = require('~Boot/routes');
/**
 * @description HTTP headers protection
 * @see https://helmetjs.github.io/
 */
app.use(helmet({
  /**
   * @description CSP protection options
   * @see https://github.com/helmetjs/csp/tree/v2.10.0
   */
  contentSecurityPolicy: JSON.parse(fs.readFileSync('./security/csp.json')),

  /**
   * @description Referrer Policy options
   * @see https://helmetjs.github.io/docs/referrer-policy/
   */
  referrerPolicy: {
    policy: 'same-origin'
  }
}));

app.use(routes);

module.exports = app;