import React from 'react';
import styles from './styles.module.scss';
import logo from 'assets/logo.png';
import history from '../../browserhistory';
import PlaceIcon from '@material-ui/icons/Place';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const onLogoClick = () => {
    history.push('/');
  };

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLeft}>
        <img
          src={logo}
          onClick={onLogoClick}
          className={styles.logo}
          alt="logo"
        />

        <p className={styles.footerCopyright}>Tourney Master &copy; 2020</p>
      </div>

      <div className={styles.footerCenter}>
        <div className={styles.footerWithIcon}>
          <PlaceIcon />
          <p>1111 Park Ave New York, NY</p>
        </div>

        <div className={styles.footerWithIcon}>
          <PhoneIcon />
          <p>+1.555.555.5555</p>
        </div>

        <div className={styles.footerWithIcon}>
          <EmailIcon />
          <p>email@email.com</p>
        </div>
      </div>

      <div className={styles.footerRight}>
        <ul className={styles.footerLinks}>
          <li>
            <Link to="/dashboard">My Dashboard</Link>
          </li>
          <li>
            <Link to="/library-manager">Library Manager</Link>
          </li>
          <li>
            <Link to="/event-link">EventLink</Link>
          </li>
          <li>
            <Link to="/collaboration">Collaboration</Link>
          </li>
          <li>
            <Link to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/utilities">Utilities</Link>
          </li>
          <li>
            <Link to="event-day-complexities">Event Day Complexities</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
