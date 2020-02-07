import React from 'react';
import { Redirect } from 'react-router-dom';
import { Routes } from '../../common/constants';

const withUnprotectedRoute = (Component: React.ComponentType<any>) => (
  props: any
) => {
  const userToket = localStorage.getItem('token');

  return Boolean(userToket) ? (
    <Redirect to={Routes.DEFAULT} />
  ) : (
    <Component {...props} />
  );
};

export default withUnprotectedRoute;
