import React from 'react';
import styles from './styles.module.scss';
import logo from 'assets/logo.png';
import history from '../../browserhistory';

const Footer: React.FC = () => {
  const onLogoClick = () => {
    history.push('/');
  };

  return (
    <div className={styles.container}>
      <img
        src={logo}
        onClick={onLogoClick}
        className={styles.logo}
        alt="logo"
      />
      <div>&copy; 2020 Tourney Master</div>
    </div>
  );
};

export default Footer;
