import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import History from 'browserhistory';
import { loadScoresData } from './logic/actions';
import Navigation from './components/navigation';
import { Loader, PopupExposure, TableSchedule } from 'components/common';
import {
  IDivision,
  ITeam,
  IEventSummary,
  ISchedulesDetails,
  IFacility,
  IEventDetails,
  IField,
  ISchedule,
  IPool,
} from 'common/models';
import { Routes, TableScheduleTypes } from 'common/enums';
import styles from './styles.module.scss';
import {
  mapFacilitiesData,
  mapFieldsData,
  mapTeamsData,
  mapDivisionsData,
} from 'components/schedules/mapTournamentData';
import { getTimeValuesFromEventSchedule, calculateTimeSlots } from 'helpers';
import {
  sortFieldsByPremier,
  defineGames,
  IGame,
} from 'components/common/matrix-table/helper';
import { IAppState } from 'reducers/root-reducer.types';
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
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  event: IEventDetails | null;
  facilities: IFacility[];
  fields: IField[];
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  schedule: ISchedule | null;
  eventSummary: IEventSummary[];
  schedulesDetails: ISchedulesDetails[];
  schedulesTeamCards?: ITeamCard[];
  loadScoresData: (eventId: string) => void;
  fillSchedulesTable: (teamCards: ITeamCard[]) => void;
}

interface State {
  games?: IGame[];
  timeSlots?: ITimeSlot[];
  teams?: IScheduleTeam[];
  fields?: IScheduleField[];
  facilities?: IScheduleFacility[];
  divisions?: IScheduleDivision[];
  isExposurePopupOpen: boolean;
  isEnterScores: boolean;
}

class RecordScores extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      isExposurePopupOpen: false,
      isEnterScores: false,
    };
  }

  componentDidMount() {
    const { loadScoresData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadScoresData(eventId);
    }
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

  onChangeView = (flag: boolean) => this.setState({ isEnterScores: flag });

  leavePage = () => {
    const eventId = this.props.match.params.eventId;

    History.push(`${Routes.SCORING}/${eventId || ''}`);
  };

  onLeavePage = () => {
    const { teams } = this.props;
    const isTeamChange = teams.some(it => it.isChange);

    // ! change in future
    !isTeamChange
      ? this.setState({ isExposurePopupOpen: true })
      : this.leavePage();
  };

  onClosePopup = () => this.setState({ isExposurePopupOpen: false });

  render() {
    const {
      isLoading,
      divisions,
      event,
      eventSummary,
      pools,
      schedule,
      schedulesTeamCards,
    } = this.props;

    const {
      fields,
      timeSlots,
      games,
      facilities,
      isEnterScores,
      isExposurePopupOpen,
    } = this.state;

    const loadCondition = !!(
      fields?.length &&
      games?.length &&
      timeSlots?.length &&
      facilities?.length &&
      event &&
      Boolean(divisions.length) &&
      Boolean(pools.length) &&
      Boolean(eventSummary.length) &&
      schedulesTeamCards?.length
    );

    return (
      <>
        <Navigation
          isEnterScores={isEnterScores}
          onLeavePage={this.onLeavePage}
          onChangeView={this.onChangeView}
        />
        <section className={styles.scoringWrapper}>
          <h2 className="visually-hidden">Scoring</h2>
          {loadCondition && !isLoading ? (
            <TableSchedule
              tableType={TableScheduleTypes.SCORES}
              event={event!}
              fields={fields!}
              games={games!}
              timeSlots={timeSlots!}
              pools={pools}
              divisions={divisions!}
              facilities={facilities!}
              teamCards={schedulesTeamCards!}
              eventSummary={eventSummary!}
              scheduleData={schedule!}
              isEnterScores={isEnterScores}
              onTeamCardsUpdate={() => {}}
              onTeamCardUpdate={() => {}}
              onUndo={() => {}}
            />
          ) : (
            <Loader />
          )}
        </section>
        <PopupExposure
          isOpen={isExposurePopupOpen}
          onClose={this.onClosePopup}
          onExitClick={this.leavePage}
          onSaveClick={() => {}}
        />
      </>
    );
  }
}

export default connect(
  ({ recordScores, schedulesTable }: IAppState) => ({
    isLoading: recordScores.isLoading,
    isLoaded: recordScores.isLoaded,
    event: recordScores.event,
    facilities: recordScores.facilities,
    fields: recordScores.fields,
    divisions: recordScores.divisions,
    pools: recordScores.pools,
    teams: recordScores.teams,
    schedule: recordScores.schedule,
    eventSummary: recordScores.eventSummary,
    schedulesTeamCards: schedulesTable?.current,
    schedulesDetails: recordScores.schedulesDetails,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadScoresData, fillSchedulesTable }, dispatch)
)(RecordScores);
