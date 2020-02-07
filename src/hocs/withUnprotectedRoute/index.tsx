import React from 'react';
import { Redirect } from 'react-router-dom';
import { Routes } from '../../common/constants';

const withUnprotectedRoute = (Component: any) => (prop: any) => {
  const userToket = localStorage.getItem('token');

  return Boolean(userToket) ? (
    <Redirect to={Routes.DEFAULT} />
  ) : (
    <Component {...prop} />
  );
};

export default withUnprotectedRoute;
