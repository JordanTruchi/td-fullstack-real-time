/**
 * @file Cross-origin resource sharing (CORS) configuration for express middleware
 */

const { readFileSync } = require('fs');

/**
 * @description CORS configuration filename
 */
const corsFile = './security/cors.json',
      options = JSON.parse(readFileSync(corsFile));

module.exports = options;