import React from 'react';
import { Auth } from 'aws-amplify';
import styles from './style.module.scss';

const UserInfo: React.FC = () => {
  const userLogo = '';

  return (
    <div
      onClick={() => {
        Auth.signOut();

        localStorage.removeItem('token');
      }}
      style={{ backgroundImage: userLogo }}
      className={styles.container}
    />
  );
};

export default UserInfo;
