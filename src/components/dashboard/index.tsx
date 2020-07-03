import React from 'react';
import { connect } from 'react-redux';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { History } from 'history';
import { Loader } from 'components/common';
import {
  ITeam,
  IField,
  BindingAction,
  ICalendarEvent,
  IOrganization,
  IEventDetails,
  IFacility,
  ISchedule,
} from 'common/models';
import { EventStatuses, ScheduleStatuses } from 'common/enums';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Paper from '../common/paper';
import OnboardingWizard from 'components/onboarding-wizard';
import { loadOrganizations } from 'components/organizations-management/logic/actions';
import TimelineCard from './timeline-card';
import NotificationsCard from './notifications-card';
import InfoCard from './info-card';
import TournamentCard from './tournament-card';
import { getEvents, getCalendarEvents } from './logic/actions';
import styles from './style.module.scss';

interface IFieldWithEventId extends IField {
  event_id: string;
}

interface IDashboardProps {
  history: History;
  events: IEventDetails[];
  teams: ITeam[];
  gameCounts: object;
  fields: IFieldWithEventId[];
  facilities: IFacility[];
  schedules: ISchedule[];
  isLoading: boolean;
  isDetailLoading: boolean;
  areCalendarEventsLoading: boolean;
  getEvents: () => void;
  getCalendarEvents: BindingAction;
  calendarEvents: ICalendarEvent[];
  loadOrganizations: BindingAction;
  organizations: IOrganization[];
}

interface IDashboardState {
  order: number;
  filters: { status: number[]; historical: boolean };
  isOnboardingWizardOpen: boolean;
}

class Dashboard extends React.Component<IDashboardProps, IDashboardState> {
  state = {
    order: 1,
    filters: { status: [1, 0], historical: false },
    isOnboardingWizardOpen: false,
  };

  componentDidMount() {
    const { loadOrganizations, getEvents, getCalendarEvents } = this.props;

    loadOrganizations();
    getEvents();
    getCalendarEvents();
  }

  componentDidUpdate(prevProps: IDashboardProps) {
    const { organizations } = this.props;

    if (
      !prevProps.organizations.length &&
      prevProps.organizations !== organizations
    ) {
      this.setState({
        isOnboardingWizardOpen: !organizations.length,
      });
    }
  }

  onCreateTournament = () => this.props.history.push('/event/event-details');

  onOrderChange = (order: number) => this.setState({ order });

  filterEvents = (status: number) => {
    const { filters } = this.state;

    if (filters.status.includes(status)) {
      this.setState({
        filters: {
          historical: false,
          status: filters.status.filter((filter: number) => filter !== status),
        },
      });
    } else {
      this.setState({
        filters: {
          historical: false,
          status: [...filters.status, status],
        },
      });
    }
  };

  onPublishedFilter = () => this.filterEvents(EventStatuses.Published);

  onDraftFilter = () => this.filterEvents(EventStatuses.Draft);

  onHistoricalFilter = () => {
    const { filters } = this.state;

    this.setState({
      filters: {
        status: [],
        historical: !filters.historical,
      },
    });
  };

  renderEvents = () => {
    const {
      events,
      facilities,
      fields,
      gameCounts,
      history,
      isDetailLoading,
      isLoading,
      schedules,
      teams,
    } = this.props;
    const { filters } = this.state;

    const filteredEvents = filters.historical
      ? events.filter(event => new Date(event.event_enddate) < new Date())
      : events.filter(event => filters.status.includes(event.is_published_YN));

    const numOfPublished = events?.filter(
      event => event.is_published_YN === EventStatuses.Published
    ).length;
    const numOfDraft = events?.filter(
      event => event.is_published_YN === EventStatuses.Draft
    ).length;

    const numOfHistorical = events?.filter(
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
                filters.status.includes(EventStatuses.Published) &&
                !filters.historical
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
                filters.status.includes(EventStatuses.Draft) &&
                !filters.historical
                  ? 'squared'
                  : 'squaredOutlined'
              }
              onClick={this.onDraftFilter}
            />
            <Button
              label={`Historical (${numOfHistorical})`}
              variant="contained"
              color="primary"
              type={filters.historical ? 'squared' : 'squaredOutlined'}
              onClick={this.onHistoricalFilter}
            />
          </div>
        </div>
        <div className={styles.tournamentsListContainer}>
          {isLoading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
          {filteredEvents?.length && !isLoading
            ? filteredEvents.map((event: IEventDetails) => (
                <TournamentCard
                  key={event.event_id}
                  event={event}
                  history={history}
                  numOfTeams={
                    teams.filter(team => team.event_id === event.event_id)
                      ?.length
                  }
                  numOfFields={
                    fields.filter(field => field.event_id === event.event_id)
                      ?.length
                  }
                  numOfGameCount={gameCounts[event.event_id]}
                  numOfLocations={
                    facilities.filter(
                      facility => facility.event_id === event.event_id
                    )?.length
                  }
                  lastScheduleRelease={
                    schedules.filter(
                      schedule =>
                        schedule.event_id === event.event_id &&
                        schedule.is_published_YN === ScheduleStatuses.Published
                    )[0]?.updated_datetime
                  }
                  isDetailLoading={isDetailLoading}
                />
              ))
            : !isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>
                    You have not any events just yet. Start with the above "+
                    Create Event" button.
                  </span>
                </div>
              )}
        </div>
      </div>
    );
  };

  renderNotifications = () => (
    <div className={styles.notificationsContainer} key={2}>
      <NotificationsCard
        data={this.props.calendarEvents.filter(
          event =>
            event.cal_event_type === 'reminder' &&
            event.status_id === 1 &&
            new Date(event.cal_event_datetime) > new Date()
        )}
        areCalendarEventsLoading={this.props.areCalendarEventsLoading}
      />
    </div>
  );

  renderTimeline = () => (
    <div className={styles.timelineContainer} key={3}>
      <TimelineCard
        data={this.props.calendarEvents.filter(event => event.cal_event_id)}
        areCalendarEventsLoading={this.props.areCalendarEventsLoading}
      />
    </div>
  );

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
    const { isOnboardingWizardOpen } = this.state;
    const { calendarEvents, events } = this.props;

    return (
      <div className={styles.main}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <Button
              label="+ Create Event"
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
            info={`${events?.length} Events`}
            order={1}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<NotificationsIcon fontSize="large" />}
            info={`${
              calendarEvents.filter(
                event =>
                  event.cal_event_type === 'reminder' &&
                  event.status_id === 1 &&
                  new Date(event.cal_event_datetime) > new Date()
              ).length
            } Pending Reminders`}
            order={2}
            changeOrder={this.onOrderChange}
          />
          <InfoCard
            icon={<FormatListBulletedIcon fontSize="large" />}
            info={`${
              calendarEvents.filter(
                event =>
                  event.cal_event_type === 'task' && event.status_id === 1
              ).length
            } Pending/Open Tasks`}
            order={3}
            changeOrder={this.onOrderChange}
          />
        </div>
        {this.renderDashbaordInOrder()}
        <OnboardingWizard isOpen={isOnboardingWizardOpen} />
      </div>
    );
  }
}
interface IState {
  events: {
    data: IEventDetails[];
    teams: ITeam[];
    gameCounts: object;
    fields: IFieldWithEventId[];
    facilities: IFacility[];
    schedules: ISchedule[];
    calendarEvents: ICalendarEvent[];
    isLoading: boolean;
    isDetailLoading: boolean;
    areCalendarEventsLoading: boolean;
  };
  organizationsManagement: { organizations: IOrganization[] };
}

const mapStateToProps = (state: IState) => ({
  events: state.events.data,
  teams: state.events.teams,
  gameCounts: state.events.gameCounts,
  fields: state.events.fields,
  facilities: state.events.facilities,
  schedules: state.events.schedules,
  calendarEvents: state.events.calendarEvents,
  isLoading: state.events.isLoading,
  isDetailLoading: state.events.isDetailLoading,
  areCalendarEventsLoading: state.events.areCalendarEventsLoading,
  organizations: state.organizationsManagement.organizations,
});

const mapDispatchToProps = {
  getEvents,
  getCalendarEvents,
  loadOrganizations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
