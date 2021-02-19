import { backHttp } from 'Services/http';


/**
 * @async
 * @description HTTP request to get all post
 * @return {Object} 
 */
async function list () {
  return await backHttp.get('/post');
}

/**
 * @async
 * @description HTTP request to create post
 * @param {Object} data
 * @return {Object} 
 */
async function create (data) {
  return await backHttp.post('/post/', data);
}

/**
 * @async
 * @description HTTP request to like a post with id
 * @param {Number} id
 * @param {Object} data
 * @return {Object} 
 */
async function like (id, data) {
  return await backHttp.put('/post/'+ id, data);
}

export {
  list,
  create,
  like
}