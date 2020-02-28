import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import NotificationsIcon from '@material-ui/icons/Notifications';
import styles from './style.module.scss';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Paper from '../common/paper';
import TimelineCard from './timeline-card';
import NotificationsCard from './notifications-card';
import InfoCard from './info-card';
import TournamentCard from './tournament-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { getEvents } from './logic/actions';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { Loader } from 'components/common';
import { data, notificationData } from './mockData';
import { ITeam } from 'common/models';
import { IField } from 'components/schedules';

interface IFieldWithEventId extends IField {
  event_id: string;
}

interface IDashboardProps {
  history: History;
  events: EventDetailsDTO[];
  teams: ITeam[];
  fields: IFieldWithEventId[];
  isLoading: boolean;
  isDetailLoading: boolean;
  getEvents: () => void;
}

class Dashboard extends React.Component<IDashboardProps> {
  state = { order: 1 };
  componentDidMount() {
    this.props.getEvents();
  }

  onCreateTournament = () => {
    this.props.history.push('event/event-details');
  };
  onOrderChange = (order: number) => {
    this.setState({ order });
  };

  renderEvents = () => {
    return (
      <div className={styles.tournamentsContainer} key={1}>
        <div className={styles.tournamentsHeading}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <FontAwesomeIcon
                size="xs"
                icon={faTrophy}
                style={{ marginRight: '5px' }}
              />
              Events
            </div>
          </div>
          <div className={styles.buttonsGroup}>
            <Button
              label="Published (1)"
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
        <div className={styles.tournamentsListContainer}>
          {this.props.isLoading && <Loader />}
          {this.props.events?.length && !this.props.isLoading
            ? this.props.events.map((event: EventDetailsDTO) => (
                <TournamentCard
                  key={event.event_id}
                  event={event}
                  history={this.props.history}
                  numOfTeams={
                    this.props.teams.filter(
                      team => team.event_id === event.event_id
                    )?.length
                  }
                  numOfFields={
                    this.props.fields.filter(
                      field => field.event_id === event.event_id
                    )?.length
                  }
                  isDetailLoading={this.props.isDetailLoading}
                />
              ))
            : !this.props.isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>There are no events yet.</span>
                </div>
              )}
        </div>
      </div>
    );
  };

  renderNotifications = () => {
    return (
      <div className={styles.notificationsContainer} key={2}>
        <NotificationsCard data={notificationData} />
      </div>
    );
  };

  renderTimeline = () => {
    return (
      <div className={styles.timelineContainer} key={3}>
        <TimelineCard data={data} />
      </div>
    );
  };

  renderDashbaordInOrder = () => {
    const { order } = this.state;
    switch (order) {
      case 1:
        return [
          this.renderEvents(),
          this.renderNotifications(),
          this.renderTimeline(),
        ];
      case 2:
        return [
          this.renderNotifications(),
          this.renderEvents(),
          this.renderTimeline(),
        ];
      case 3:
        return [
          this.renderTimeline(),
          this.renderNotifications(),
          this.renderEvents(),
        ];
      default:
        return [
          this.renderEvents(),
          this.renderNotifications(),
          this.renderTimeline(),
        ];
    }
  };

  render() {
    return (
      <div className={styles.main}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <Button
              label="Create Tournament"
              variant="contained"
              color="primary"
              onClick={this.onCreateTournament}
            />
          </div>
        </Paper>
        <div className={styles.heading}>
          <HeadingLevelTwo>My Dashboard</HeadingLevelTwo>
        </div>
        <div className={styles.dashboardCardsContainer}>
          <InfoCard
            icon={<FontAwesomeIcon size="lg" icon={faTrophy} />}
            info={`${this.props.events?.length} Events`}
            order={1}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<NotificationsIcon fontSize="large" />}
            info="0 New Notifications"
            order={2}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<FormatListBulletedIcon fontSize="large" />}
            info="2 Pending Tasks"
            order={3}
            changeOrder={this.onOrderChange}
          />
        </div>
        {this.renderDashbaordInOrder()}
      </div>
    );
  }
}
interface IState {
  events: {
    data: EventDetailsDTO[];
    teams: ITeam[];
    fields: IFieldWithEventId[];
    isLoading: boolean;
    isDetailLoading: boolean;
  };
}

const mapStateToProps = (state: IState) => ({
  events: state.events.data,
  teams: state.events.teams,
  fields: state.events.fields,
  isLoading: state.events.isLoading,
  isDetailLoading: state.events.isDetailLoading,
});

const mapDispatchToProps = {
  getEvents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
