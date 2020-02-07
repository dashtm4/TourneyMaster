import React from 'react';
import { Redirect } from 'react-router-dom';
import { Routes } from '../../common/constants';

const withProtectedRoute = (Component: any) => (prop: any) => {
  const userToket = localStorage.getItem('token');

  return Boolean(userToket) ? (
    <Component {...prop} />
  ) : (
    <Redirect to={Routes.LOGIN} />
  );
};

export default withProtectedRoute;
