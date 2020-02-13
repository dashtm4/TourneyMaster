import React from 'react';
import Button from '../../common/buttons/button';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const TimelineCard = ({ data }: any) => (
  <Paper>
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <FormatListBulletedIcon
            fontSize="small"
            className={styles.cardIcon}
          />
          Timeline
        </div>
        <Button
          label="View Calendar"
          variant="text"
          color="secondary"
          icon={<CalendarTodayIcon fontSize="small" />}
        />
      </div>
      <ul className={styles.notificationsList}>
        {data.map((event: any, index: number) => (
          <li key={index} className={styles.notification}>
            <div className={styles.line} />
            <div className={styles.oval} />
            <div className={styles.notificationMessage}>
              <div>
                {event.message}
                <a
                  href={process.env.REACT_APP_REDIRECT_URL}
                  className={styles.messageLink}
                >
                  {event.link}
                </a>
              </div>
              <div className={styles.additionalMessage}>{event.date}</div>
            </div>
          </li>
        ))}
        <ExpandMoreIcon className={styles.expand} fontSize="large" />
      </ul>
    </div>
  </Paper>
);

export default TimelineCard;
