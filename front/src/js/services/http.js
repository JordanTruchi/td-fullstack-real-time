import axios from 'axios';

// generate axios instance with env variable and export it
const backHttp = axios.create({
  baseURL: `${process.env.API_HOST}:${process.env.API_PORT}${process.env.APP_PATH}${process.env.API_VERSION_PATH}`,
});

backHttp.interceptors.request.use(function (config) {

  if (window && window.localStorage.getItem('token')) {
    config.headers.Authorization= "Bearer " + window.localStorage.getItem('token');
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

export { backHttp };