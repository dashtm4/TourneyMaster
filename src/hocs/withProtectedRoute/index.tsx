import React from 'react';
import { Redirect } from 'react-router-dom';
import { Routes } from '../../common/constants';

const withProtectedRoute = (Component: React.ComponentType<any>) => (
  props: any
) => {
  const userToket = localStorage.getItem('token');

  return Boolean(userToket) ? (
    <Component {...props} />
  ) : (
    <Redirect to={Routes.LOGIN} />
  );
};

export default withProtectedRoute;
