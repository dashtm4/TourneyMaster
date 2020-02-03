import React from 'react';
import styles from './style.module.scss';

const UserInfo: React.FC = () => {
  const userLogo = '';

  return (
    <div style={{ backgroundImage: userLogo }} className={styles.container} />
  );
};

export default UserInfo;
