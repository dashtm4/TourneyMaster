import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import hisory from '../../../browserhistory';
import { Routes } from '../../../common/constants';
import styles from './style.module.scss';

const USER_LOGO = '';

const UserInfo: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ul className={styles.userList}>
      <li>
        <p className={styles.userImgWrapper}>
          <img src={USER_LOGO} width="36" height="36" alt="" />
          <button
            className={styles.userNavBtn}
            onClick={handleClick}
            aria-controls="user-nav-menu"
            aria-haspopup="true"
          >
            <span className="visually-hidden">Open menu</span>
          </button>
        </p>
        <Menu
          id="user-nav-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            id="org-management"
            onClick={() => {
              console.log('management');
              hisory.replace(Routes.ORGANIZATIONS_MANAGEMENT);
            }}
          >
            My Organizations
          </MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.clear();

              hisory.replace(Routes.LOGIN);
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </li>
    </ul>
  );
};

export default UserInfo;
