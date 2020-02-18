import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import logo from 'assets/logo.png';
import UserInfo from './user-info';
import styles from './style.module.scss';

const Header: React.FC<RouteComponentProps> = ({ history }) => {
  const menuItems: string[] = [
    'Home',
    'Event Production',
    'Event Search',
    'Support',
    'About',
    'Contact',
  ];

  const onMenuClick = (item: string) => {
    return item;
  };

  const onLogoClick = () => {
    history.push('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img
          src={logo}
          onClick={onLogoClick}
          className={styles.logo}
          alt="logo"
        />
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {menuItems.map((item: string, index: number) => (
              <li
                className={styles.listItem}
                onClick={onMenuClick.bind(undefined, item)}
                key={index}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <UserInfo />
      </div>
    </div>
  );
};

export default withRouter(Header);
