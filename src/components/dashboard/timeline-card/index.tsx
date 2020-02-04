import React from 'react';
import Button from '../../common/buttons/button';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const TimelineCard = ({ data }: any) => (
  <Paper>
    <div className={styles['card-container']}>
      <div className={styles['card-header']}>
        <div className={styles['card-title']}>
          <FormatListBulletedIcon
            fontSize="small"
            className={styles['card-icon']}
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
      <ul>
        {data.map((event: any, index: number) => (
          <li key={index} className={styles.notification}>
            <div className={styles['notification-message']}>
              <div>{event.message}</div>
              <div className={styles['additional-message']}>{event.date}</div>
            </div>
          </li>
        ))}
      </ul>
      <ExpandMoreIcon className={styles.expand} fontSize="large" />
    </div>
  </Paper>
);

export default TimelineCard;
