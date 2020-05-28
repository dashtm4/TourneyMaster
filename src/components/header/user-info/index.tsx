import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import hisory from '../../../browserhistory';
import { Routes } from 'common/enums';
import styles from './style.module.scss';
import Divider from '@material-ui/core/Divider';

// const USER_LOGO = '';

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
          <button
            className={styles.userNavBtn}
            onClick={handleClick}
            aria-controls="user-nav-menu"
            aria-haspopup="true"
          >
            {/* <img src={USER_LOGO} width="36" height="36" alt="" /> */}
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
            onClick={() => {
              hisory.replace(Routes.SUPPORT);
              handleClose();
            }}
          >
            Give Feedback
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.location.href = 'https://www.tourneymaster.org/contact/';
            }}
          >
            Get Help
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.location.href = 'https://www.tourneymaster.org/about/';
            }}
          >
            About
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.location.href =
                'https://www.tourneymaster.org/privacy-policy/';
            }}
          >
            Privacy Policy
          </MenuItem>
          <Divider light />
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
