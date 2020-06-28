import API from './api';

export const login = (username:string, password:string) => {
  return API.post('/auth/login', {username, password}).then((response) => {
    localStorage.setItem('isLogin', 1);
    window.location = '/';
  });
}

export const logout = () => {
  localStorage.setItem('isLogin', 0);

  API.get('/auth/logout').then((response) => {;
    window.location = '/';
  });
}

export const isLogin = () => {
  return localStorage.getItem('isLogin') == 1 ? true : false;
}
