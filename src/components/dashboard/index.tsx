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

interface IDashboardState {
  order: number;
  filters: { status: string[]; historical: boolean };
}

enum EventStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  state = {
    order: 1,
    filters: { status: ['Published', 'Draft'], historical: false },
  };

  componentDidMount() {
    this.props.getEvents();
  }

  onCreateTournament = () => {
    this.props.history.push('/event/event-details');
  };
  onOrderChange = (order: number) => {
    this.setState({ order });
  };

  onPublishedFilter = () => {
    const { filters } = this.state;
    if (filters.status.includes(EventStatus.PUBLISHED)) {
      this.setState({
        filters: {
          ...filters,
          status: filters.status.filter(
            (filter: string) => filter !== EventStatus.PUBLISHED
          ),
        },
      });
    } else {
      this.setState({
        filters: {
          ...filters,
          status: [...filters.status, EventStatus.PUBLISHED],
        },
      });
    }
  };

  onDraftFilter = () => {
    const { filters } = this.state;
    if (filters.status.includes(EventStatus.DRAFT)) {
      this.setState({
        filters: {
          ...filters,
          status: filters.status.filter(
            (filter: string) => filter !== EventStatus.DRAFT
          ),
        },
      });
    } else {
      this.setState({
        filters: {
          ...filters,
          status: [...filters.status, EventStatus.DRAFT],
        },
      });
    }
  };

  onHistoricalFilter = () => {
    this.setState({
      filters: {
        ...this.state.filters,
        historical: !this.state.filters.historical,
      },
    });
  };

  renderEvents = () => {
    const filteredEvents = this.props.events
      .filter(event => this.state.filters.status.includes(event.event_status))
      .filter(event =>
        this.state.filters.historical
          ? new Date(event.event_enddate) < new Date()
          : event
      );

    const numOfPublished = this.props.events?.filter(
      event => event.event_status === EventStatus.PUBLISHED
    ).length;
    const numOfDraft = this.props.events?.filter(
      event => event.event_status === EventStatus.DRAFT
    ).length;

    const numOfHistorical = this.props.events?.filter(
      event => new Date(event.event_enddate) < new Date()
    ).length;

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
              label={`Published (${numOfPublished})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.status.includes('Published')
                  ? 'squared'
                  : 'squaredOutlined'
              }
              onClick={this.onPublishedFilter}
            />
            <Button
              label={`Draft (${numOfDraft})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.status.includes('Draft')
                  ? 'squared'
                  : 'squaredOutlined'
              }
              onClick={this.onDraftFilter}
            />
            <Button
              label={`Historical (${numOfHistorical})`}
              variant="contained"
              color="primary"
              type={
                this.state.filters.historical ? 'squared' : 'squaredOutlined'
              }
              onClick={this.onHistoricalFilter}
            />
          </div>
        </div>
        <div className={styles.tournamentsListContainer}>
          {this.props.isLoading && <Loader />}
          {filteredEvents?.length && !this.props.isLoading
            ? filteredEvents.map((event: EventDetailsDTO) => (
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
