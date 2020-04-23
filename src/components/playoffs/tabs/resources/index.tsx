import React, { Component } from 'react';
import { orderBy } from 'lodash-es';
import styles from './styles.module.scss';
import { MatrixTable, Loader } from 'components/common';
import {
  IEventDetails,
  IDivision,
  IPool,
  IEventSummary,
  ISchedule,
  ISchedulesDetails,
} from 'common/models';
import { IField } from 'common/models/schedule/fields';
import { ITeamCard } from 'common/models/schedule/teams';
import { IGame } from 'components/common/matrix-table/helper';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { TableScheduleTypes } from 'common/enums';
import { IBracketGame } from 'components/playoffs/bracketGames';
import BracketGameCard from 'components/playoffs/dnd/bracket-game';
import {
  MatrixTableDropEnum,
  IDropParams,
} from 'components/common/matrix-table/dnd/drop';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';

interface IProps {
  bracketGames?: IBracketGame[];
  event?: IEventDetails | null;
  divisions?: IDivision[];
  pools?: IPool[];
  teamCards?: ITeamCard[];
  games?: IGame[];
  fields?: IField[];
  timeSlots?: ITimeSlot[];
  scheduleData?: ISchedule;
  facilities?: IScheduleFacility[];
  eventSummary?: IEventSummary[];
  schedulesDetails?: ISchedulesDetails[];
  onTeamCardsUpdate: (teamCard: ITeamCard[]) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onUndo: () => void;
  updateGame: (game: IGame, withGame?: IGame) => void;
}

interface IState {
  tableGames?: IGame[];
  divisionOptions?: IMultiSelectOption[];
  filteredGames?: IGame[];
}

class ResourceMatrix extends Component<IProps> {
  state: IState = {};

  componentDidMount() {
    const { divisions } = this.props;
    if (divisions) {
      const divisionOptions = divisions.map(item => ({
        label: item.short_name,
        value: item.division_id,
        checked: true,
      }));
      this.setState({ divisionOptions });
    }
  }

  componentDidUpdate(_: any, prevState: IState) {
    const { divisionOptions, filteredGames } = this.state;

    if (
      prevState.divisionOptions !== divisionOptions ||
      (!filteredGames && this.props.games)
    ) {
      const divisionIds =
        this.state.divisionOptions
          ?.filter(item => item.checked)
          .map(item => item.value) || [];

      const filteredGames = this.props.games?.map(game =>
        divisionIds.includes(
          game.awayTeam?.divisionId! ||
            game.homeTeam?.divisionId! ||
            game.divisionId!
        )
          ? game
          : {
              ...game,
              awayTeam: undefined,
              homeTeam: undefined,
              awayDependsUpon: undefined,
              homeDependsUpon: undefined,
              awaySeedId: undefined,
              homeSeedId: undefined,
            }
      );

      this.setState({
        filteredGames,
      });
    }
  }

  setSelectedDivision = (name: string, data: IMultiSelectOption[]) =>
    this.setState({ [name]: data });

  renderGame = (game: IGame, index: number) => {
    return (
      <BracketGameCard
        key={`${index}-renderGame`}
        game={game}
        type={MatrixTableDropEnum.BracketDrop}
      />
    );
  };

  onMoveCard = (dropParams: IDropParams) => {
    const { teamId, gameId } = dropParams;
    const { games } = this.props;
    const dragGame = games!.find(item => +item.id === +teamId)!;
    const dropGame = games!.find(item => item.id === gameId)!;

    this.props.updateGame(dragGame);
    this.props.updateGame(dropGame, dragGame);
  };

  render() {
    const {
      event,
      divisions,
      pools,
      teamCards,
      fields,
      timeSlots,
      facilities,
      scheduleData,
      eventSummary,
      onTeamCardsUpdate,
      onTeamCardUpdate,
      onUndo,
      games,
    } = this.props;

    const { divisionOptions, filteredGames } = this.state;

    const tableBracketGames = games?.filter(
      v =>
        v.isPlayoff &&
        v.divisionId &&
        v.playoffIndex &&
        (v.awaySeedId ||
          v.homeSeedId ||
          v.awayDisplayName ||
          v.homeDisplayName ||
          v.awayDependsUpon ||
          v.homeDependsUpon)
    );
    const orderedGames = orderBy(tableBracketGames, 'divisionId');

    return (
      <section className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.gamesTitle}>Bracket Games</div>
          {orderedGames?.map((v, i) => this.renderGame(v, i))}
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.filterWrapper}>
            {!!divisionOptions?.length && (
              <fieldset className={styles.selectWrapper}>
                <legend className={styles.selectTitle}>Divisions</legend>
                <MultiSelect
                  placeholder="Select"
                  name="divisionOptions"
                  selectOptions={divisionOptions}
                  onChange={this.setSelectedDivision}
                />
              </fieldset>
            )}
          </div>

          {event &&
          divisions &&
          pools &&
          teamCards &&
          filteredGames &&
          fields &&
          timeSlots &&
          facilities &&
          eventSummary &&
          onTeamCardsUpdate &&
          scheduleData &&
          onTeamCardUpdate &&
          onUndo ? (
            <MatrixTable
              tableType={TableScheduleTypes.BRACKETS}
              games={filteredGames}
              fields={fields}
              timeSlots={timeSlots}
              facilities={facilities}
              showHeatmap={true}
              isEnterScores={false}
              moveCard={this.onMoveCard}
              disableZooming={false}
              onTeamCardUpdate={onTeamCardUpdate}
              onTeamCardsUpdate={onTeamCardsUpdate}
              teamCards={teamCards}
              isFullScreen={false}
              onToggleFullScreen={() => {}}
            />
          ) : (
            <Loader styles={{ height: '100%' }} />
          )}
        </div>
      </section>
    );
  }
}

export default ResourceMatrix;
