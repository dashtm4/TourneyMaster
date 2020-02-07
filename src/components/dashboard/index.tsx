import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import styles from './style.module.scss';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Paper from '../common/paper';
import schedule from '../../assets/schedule.svg';
import TimelineCard from './timeline-card';
import NotificationsCard from './notifications-card';
import InfoCard from './info-card';
import TournamentCard from './tournament-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { getEvents } from './logic/actions';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import CircularProgress from '@material-ui/core/CircularProgress';

const data = [
  { message: 'Publish', link: 'Men’s Spring Thaw', date: '01/14/20' },
  { message: 'Create Tournament', link: 'Spring Lacrosse', date: '01/14/20' },
  {
    message: 'Release Retrospective for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '02/15/20',
  },
];

const notificationData = [
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
  {
    message: 'Robert Smith has added you as a collaborator for',
    link: 'Draft Summer Lacrosse',
    date: '01/14/20',
  },
  {
    message: 'Reminder: Release Retrospective is 2 weeks overdue for',
    link: 'Field Hockey I',
    date: '01/14/20',
  },
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
];

interface IDashboardProps {
  history: History;
  events: EventDetailsDTO[];
  getEvents: () => void;
}

class Dashboard extends React.Component<IDashboardProps> {
  async componentDidMount() {
    this.props.getEvents();
  }

  onCreateTournament = () => {
    this.props.history.push('/event-details');
  };

  render() {
    return (
      <div className={styles.main}>
        <Paper>
          <div className={styles['main-menu']}>
            <Button
              label="Edit Dashboard Layout"
              variant="text"
              color="secondary"
              icon={<EditIcon fontSize="small" />}
            />
            <Button
              label="Create tournament"
              variant="contained"
              color="primary"
              onClick={this.onCreateTournament}
            />
          </div>
        </Paper>
        <div className={styles.heading}>
          <HeadingLevelTwo>My Dashboard</HeadingLevelTwo>
        </div>
        <div className={styles['dashboard-cards-container']}>
          <InfoCard
            icon={<AlternateEmailIcon fontSize="large" />}
            info="0 Team Mentions"
          />
          <InfoCard
            icon={<NotificationsIcon fontSize="large" />}
            info="0 New Notifications"
          />
          <InfoCard
            icon={<FormatListBulletedIcon fontSize="large" />}
            info="2 Pending Tasks"
          />
        </div>
        <div className={styles['timeline-container']}>
          <TimelineCard data={data} />
          <img
            src={schedule}
            alt="schedule"
            className={styles['schedule-image']}
          />
        </div>
        <NotificationsCard data={notificationData} />
        <div className={styles['tournaments-container']}>
          <div className={styles['tournaments-heading']}>
            <div className={styles['card-header']}>
              <div className={styles['card-title']}>
                <FontAwesomeIcon
                  size="xs"
                  icon={faTrophy}
                  style={{ marginRight: '5px' }}
                />
                Tournaments
              </div>
            </div>
            <div className={styles['buttons-group']}>
              <Button
                label="Published(1)"
                variant="contained"
                type="squared"
                color="primary"
              />
              <Button
                label="Draft (1)"
                variant="contained"
                type="squared"
                color="primary"
              />
              <Button
                label="Historical (0)"
                variant="contained"
                color="primary"
                type="squaredOutlined"
              />
            </div>
          </div>
          <div className={styles['tournaments-list-container']}>
            {this.props.events.length ? (
              this.props.events.map((event: EventDetailsDTO) => (
                <TournamentCard
                  key={event.event_id}
                  event={event}
                  history={this.props.history}
                />
              ))
            ) : (
              <CircularProgress />
            )}
          </div>
        </div>
      </div>
    );
  }
}
interface IState {
  events: { data: EventDetailsDTO[] };
}

const mapStateToProps = (state: IState) => ({
  events: state.events.data,
});

const mapDispatchToProps = {
  getEvents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
