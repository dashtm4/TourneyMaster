import React from 'react';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapper,
} from './expansion-panel-material';
import PersonIcon from '@material-ui/icons/Person';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EmailIcon from '@material-ui/icons/Email';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import ErrorIcon from '@material-ui/icons/Error';
import PinIcon from './icon-pin-material';
import styles from './styles.module.scss';

const DashboardMenu = () => (
  <section className={styles.dashboardMenu}>
    <h2 className={`${styles.itemTitle} ${styles.itemTitleAlone}`}>
      <PersonIcon className={styles.itemTitleIcon} />
      My Dashboard
    </h2>
    <ul className={styles.list}>
      <li className={styles.itemTitle}>
        <ExpansionPanelWrapped>
          <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
            <InsertDriveFileIcon className={styles.itemTitleIcon} />
            <span className={styles.itemTitle}>Library Manager</span>
          </ExpansionPanelSummaryWrapped>
          <ExpansionPanelDetailsWrapper>
            <ul className={styles.list}>
              <li className={styles.itemSubTitle}>
                <a href="#">Tournaments</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Facilities</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Registration</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Divisions &amp; Pools</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Team Management</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Scheduling</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Messaging</a>
              </li>
            </ul>
          </ExpansionPanelDetailsWrapper>
        </ExpansionPanelWrapped>
      </li>
      <li className={styles.itemTitle}>
        <ExpansionPanelWrapped>
          <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
            <EmailIcon className={styles.itemTitleIcon} />
            <span className={styles.itemTitle}>EventLink</span>
          </ExpansionPanelSummaryWrapped>
          <ExpansionPanelDetailsWrapper>
            <ul className={styles.list}>
              <li className={styles.itemSubTitle}>
                <a href="#">Messaging</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Schedule Review</a>
              </li>
            </ul>
          </ExpansionPanelDetailsWrapper>
        </ExpansionPanelWrapped>
      </li>
      <li className={`${styles.itemTitle} ${styles.itemTitleAlone}`}>
        <PeopleIcon className={styles.itemTitleIcon} />
        <a href="#">Collaboration</a>
      </li>
      <li className={`${styles.itemTitle} ${styles.itemTitleAlone}`}>
        <CalendarTodayIcon className={styles.itemTitleIcon} />
        <a href="#">Calendar</a>
      </li>
      <li className={styles.itemTitle}>
        <ExpansionPanelWrapped>
          <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
            <SettingsIcon className={styles.itemTitleIcon} />
            <span className={styles.itemTitle}>Utilities</span>
          </ExpansionPanelSummaryWrapped>
          <ExpansionPanelDetailsWrapper>
            <ul className={styles.list}>
              <li className={styles.itemSubTitle}>
                <a href="#">Edit Profile</a>
              </li>
              <li className={styles.itemSubTitle}>
                <a href="#">Email Setup</a>
              </li>
            </ul>
          </ExpansionPanelDetailsWrapper>
        </ExpansionPanelWrapped>
      </li>
      <li className={`${styles.itemTitle} ${styles.itemTitleAlone}`}>
        <ErrorIcon className={styles.itemTitleIcon} />
        <a href="#">Event Day Complexities</a>
      </li>
    </ul>
    <button className={styles.pinBtn}>
      <PinIcon />
      Unpin Menu
    </button>
  </section>
);

export default DashboardMenu;
