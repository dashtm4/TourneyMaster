import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '../../common/paper';
import styles from '../timeline-card/style.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const NotificationsCard = ({ data }: any) => (
  <Paper>
    <div className={styles['card-header']}>
      <div className={styles['card-title']}>
        <NotificationsIcon fontSize="small" className={styles['card-icon']} />
        Notifications
      </div>
    </div>
    <ul>
      {data.map((notification: any, index: number) => (
        <li key={index} className={styles.notification}>
          <div className={styles['notification-message']}>
            <div>
              {notification.message}
              <a className={styles['message-link']}>{notification.link}</a>
            </div>
            <div className={styles['additional-message']}>
              {notification.date}
            </div>
          </div>
        </li>
      ))}
    </ul>
    <ExpandMoreIcon className={styles.expand} fontSize="large" />
  </Paper>
);

export default NotificationsCard;
