import API from './api';
import { Redirect } from 'react-router-dom';

export const login = (username:string, password:string) => {
  return API.post('/auth/login', {username, password}).then((response) => {
    getUser().then((response) => {
      window.location = '/';
    });
  });
}

export const logout = () => {
  return API.get('/auth/logout').then((response) => {;
    getUser().then((response) => {
      window.location = '/';
    });
  });
}

export const isLogin = () => {
  return localStorage.getItem('username') === '' ? false : true;
}

export const isAdmin = () => {
  return localStorage.getItem('is_admin') == 1 ? true : false;
}

export const getName = () => {
  return localStorage.getItem('full_name');
}

export const getUser = () => {
  return API.get('/auth/user').then((response) => {
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('full_name', response.data.full_name);
    localStorage.setItem('is_admin', response.data.is_admin);
  }).catch((error) => {
    localStorage.setItem('username', '');
    localStorage.setItem('full_name', '');
    localStorage.setItem('is_admin', 0);
  });
}

