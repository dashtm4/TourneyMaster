import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { loadReportingData } from './logic/actions';
import Navigation from './components/navigation';
import ItemSchedules from './components/item-schedules';
import {
  stringToLink,
  getTimeValuesFromEventSchedule,
  calculateTimeSlots,
} from 'helpers';
import { HeadingLevelTwo, Loader, HazardList } from 'components/common';
import {
  IDivision,
  ITeam,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  ISchedulesDetails,
  IMenuItem,
} from 'common/models';
import { EventMenuTitles } from 'common/enums';
import { IAppState } from 'reducers/root-reducer.types';
import styles from './styles.module.scss';
import {
  mapFieldsData,
  mapTeamsData,
  mapFacilitiesData,
  mapDivisionsData,
} from 'components/schedules/mapTournamentData';
import {
  defineGames,
  sortFieldsByPremier,
  IGame,
} from 'components/common/matrix-table/helper';
import {
  ITeam as IScheduleTeam,
  ITeamCard,
} from 'common/models/schedule/teams';
import { mapTeamsFromSchedulesDetails } from 'components/schedules/mapScheduleData';
import { fillSchedulesTable } from 'components/schedules/logic/schedules-table/actions';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IScheduleDivision } from 'common/models/schedule/divisions';
import { IField as IScheduleField } from 'common/models/schedule/fields';

interface MatchParams {
  eventId: string;
}
interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  incompleteMenuItems: IMenuItem[];
  event: IEventDetails | null;
  facilities: IFacility[];
  divisions: IDivision[];
  fields: IField[];
  teams: ITeam[];
  schedulesDetails: ISchedulesDetails[];
  schedule: ISchedule | null;
  schedulesTeamCards?: ITeamCard[];
  loadReportingData: (eventId: string) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
}

interface State {
  games?: IGame[];
  timeSlots?: ITimeSlot[];
  teams?: IScheduleTeam[];
  fields?: IScheduleField[];
  facilities?: IScheduleFacility[];
  divisions?: IScheduleDivision[];
}

class Reporting extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const eventId = this.props.match.params.eventId;

    this.props.loadReportingData(eventId);
  }

  componentDidUpdate(prevProps: Props) {
    const { schedule, schedulesDetails } = this.props;
    const { teams } = this.state;

    if (!prevProps.schedule && this.props.schedule) {
      this.calculateNeccessaryData();
      return;
    }

    if (
      !prevProps.schedulesTeamCards &&
      schedulesDetails &&
      Boolean(schedulesDetails.length) &&
      teams?.length &&
      Boolean(teams?.length) &&
      schedule
    ) {
      const mappedTeams = mapTeamsFromSchedulesDetails(schedulesDetails, teams);

      this.props.fillSchedulesTable(mappedTeams);
    }
  }

  calculateNeccessaryData = () => {
    const {
      event,
      schedule,
      fields,
      teams,
      divisions,
      facilities,
    } = this.props;

    if (
      !schedule ||
      !event ||
      !Boolean(fields.length) ||
      !Boolean(teams.length) ||
      !Boolean(divisions.length) ||
      !Boolean(facilities.length)
    ) {
      return;
    }

    const timeValues = getTimeValuesFromEventSchedule(event, schedule);

    const timeSlots = calculateTimeSlots(timeValues);

    const mappedFields = mapFieldsData(fields);
    const sortedFields = sortFieldsByPremier(mappedFields);

    const { games } = defineGames(sortedFields, timeSlots!);

    const mappedTeams = mapTeamsData(teams, divisions);
    const mappedFacilities = mapFacilitiesData(facilities);

    const mappedDivisions = mapDivisionsData(divisions);

    return this.setState({
      games,
      timeSlots,
      divisions: mappedDivisions,
      fields: sortedFields,
      teams: mappedTeams,
      facilities: mappedFacilities,
    });
  };

  render() {
    const { incompleteMenuItems } = this.props;
    const isAllowViewPage = incompleteMenuItems.length === 0;

    if (!isAllowViewPage) {
      return (
        <HazardList
          incompleteMenuItems={incompleteMenuItems}
          eventId={this.props.match.params.eventId}
        />
      );
    }

    const {
      isLoading,
      divisions,
      event,
      schedule,
      schedulesTeamCards,
    } = this.props;

    const { fields, timeSlots, games, facilities } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      facilities?.length &&
      event &&
      Boolean(divisions.length) &&
      schedulesTeamCards?.length
    );

    return (
      <section id={stringToLink(EventMenuTitles.REPORTING)}>
        <Navigation />
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>{EventMenuTitles.REPORTING}</HeadingLevelTwo>
        </div>
        {loadCondition && !isLoading ? (
          <ul className={styles.reportingList}>
            <ItemSchedules
              event={event!}
              fields={fields!}
              facilities={facilities!}
              schedule={schedule!}
              timeSlots={timeSlots!}
              games={games!}
              teamCards={schedulesTeamCards!}
            />
          </ul>
        ) : (
          <Loader />
        )}
      </section>
    );
  }
}

export default connect(
  ({ reporting, schedulesTable }: IAppState) => ({
    isLoading: reporting.isLoading,
    isLoaded: reporting.isLoaded,
    event: reporting.event,
    facilities: reporting.facilities,
    fields: reporting.fields,
    divisions: reporting.divisions,
    teams: reporting.teams,
    schedule: reporting.schedule,
    schedulesTeamCards: schedulesTable?.current,
    schedulesDetails: reporting.schedulesDetails,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadReportingData, fillSchedulesTable }, dispatch)
)(Reporting);
