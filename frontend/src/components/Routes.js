import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../utils';

export const PublicRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      isLogin() ? <Redirect to="/" /> : <Component {...props} {...rest} />
    )} />
  );
};

export const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      isLogin() ? <Component {...props} {...rest} /> : <Redirect to="/login" />
    )} />
  );
};

