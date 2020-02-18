import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '../../common/paper';
import styles from '../timeline-card/style.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const NotificationsCard = ({ data }: any) => (
  <Paper>
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>
        <NotificationsIcon fontSize="small" className={styles.cardIcon} />
        Notifications
      </div>
    </div>
    <ul>
      {data.map((notification: any, index: number) => (
        <li key={index} className={styles.notification}>
          <div className={styles.notificationMessage}>
            <div>
              {notification.message}
              <a
                href={process.env.REACT_APP_REDIRECT_URL}
                className={styles.messageLink}
              >
                {notification.link}
              </a>
            </div>
            <div className={styles.additionalMessage}>{notification.date}</div>
          </div>
        </li>
      ))}
    </ul>
    <ExpandMoreIcon className={styles.expand} fontSize="large" />
  </Paper>
);

export default NotificationsCard;
