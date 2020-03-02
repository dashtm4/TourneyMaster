import React from 'react';
import Button from '../../common/buttons/button';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import Paper from '../../common/paper';
import styles from './style.module.scss';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import history from '../../../browserhistory';

interface ITimelineCardState {
  currentData: any[];
  firstElement: number;
  lastElement: number;
}
interface ITimelineCardProps {
  data: any[];
}

class TimelineCard extends React.Component<
  ITimelineCardProps,
  ITimelineCardState
> {
  state = {
    currentData: this.props.data.slice(0, 5),
    firstElement: 1,
    lastElement: 5,
  };
  onForwardClick = () => {
    if (this.state.lastElement < this.props.data?.length) {
      this.setState({
        currentData: this.props.data.slice(
          this.state.firstElement,
          this.state.lastElement + 1
        ),
        firstElement: this.state.firstElement + 1,
        lastElement: this.state.lastElement + 1,
      });
    }
  };
  onBackClick = () => {
    if (this.state.firstElement > 0) {
      this.setState({
        currentData: this.props.data.slice(
          this.state.firstElement - 2,
          this.state.lastElement - 1
        ),
        firstElement: this.state.firstElement - 1,
        lastElement: this.state.lastElement - 1,
      });
    }
  };

  onCalendarClick = () => {
    history.push('/calendar');
  };

  render() {
    return (
      <div className={styles.cardContainer}>
        <Paper>
          <div>
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
                onClick={this.onCalendarClick}
              />
            </div>
            <div className={styles.tmNotificationsContainer}>
              {this.state.firstElement > 1 && (
                <NavigateBeforeIcon
                  fontSize="large"
                  style={{ fill: '#CDCFD2', cursor: 'pointer' }}
                  onClick={this.onBackClick}
                />
              )}
              <ul className={styles.tmNotificationsList}>
                {this.state.currentData.map((event: any, index: number) => (
                  <li key={index} className={styles.tmNotification}>
                    <div className={styles.tmNotificationItem}>
                      <div className={styles.horizontalLine} />
                      <div className={styles.circle} />
                      <div className={styles.tmNotificationMessage}>
                        <div>
                          {event.message}
                          <a
                            href={process.env.REACT_APP_REDIRECT_URL}
                            className={styles.messageLink}
                          >
                            {event.link}
                          </a>
                        </div>
                        <div className={styles.additionalMessage}>
                          {event.date}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {this.state.lastElement < this.props.data?.length && (
                <NavigateNextIcon
                  fontSize="large"
                  style={{ fill: '#CDCFD2', cursor: 'pointer' }}
                  onClick={this.onForwardClick}
                />
              )}
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default TimelineCard;
