import { backHttp } from 'Services/http';


/**
 * @async
 * @description HTTP request to log in user
 * @return {Object} 
 */
async function login (user) {
  return await backHttp.post('/login', user);
}

/**
 * @async
 * @description HTTP request to register user
 * @param {Number} id
 * @return {Object} 
 */
async function register (data) {
  return await backHttp.get('/register', data);
}

async function checkAuth () {
  return await backHttp.get('/auth');
}


export {
  login,
  register,
  checkAuth
}