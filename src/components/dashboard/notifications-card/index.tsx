import React from 'react';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '../../common/paper';
import styles from '../timeline-card/style.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

interface INotificationCardState {
  currentData: any[];
}

interface INotificationCardProps {
  data: any[];
}

class NotificationsCard extends React.Component<
  INotificationCardProps,
  INotificationCardState
> {
  state = { currentData: this.props.data?.slice(0, 5) };

  onClick = () => {
    if (this.state.currentData.length < this.props.data?.length) {
      this.setState({ currentData: this.props.data?.slice(0, 10) });
    } else {
      this.setState({ currentData: this.state.currentData.slice(0, 5) });
    }
  };

  renderButton = () => {
    if (this.state.currentData.length < this.props.data?.length) {
      return (
        <ExpandMoreIcon
          className={styles.expand}
          fontSize="large"
          onClick={this.onClick}
        />
      );
    } else if (this.state.currentData.length > 5) {
      return (
        <ExpandLessIcon
          className={styles.expand}
          fontSize="large"
          onClick={this.onClick}
        />
      );
    }
  };

  render() {
    return (
      <Paper>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <NotificationsIcon fontSize="small" className={styles.cardIcon} />
            Notifications
          </div>
        </div>
        <ul className={styles.notificationsContainer}>
          {this.state.currentData.length ? (
            this.state.currentData.map((notification: any, index: number) => (
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
                  <div className={styles.additionalMessage}>
                    {notification.date}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className={styles.noFoundWrapper}>
              <span>There are no notifications yet.</span>
            </div>
          )}
        </ul>
        {this.renderButton()}
      </Paper>
    );
  }
}

export default NotificationsCard;
