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
}

class ResourceMatrix extends Component<IProps> {
  state: IState = {};

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

    const tableBracketGames = games?.filter(
      v =>
        v.isPlayoff &&
        v.divisionId &&
        v.playoffIndex &&
        (v.awaySeedId || v.homeSeedId || v.awayDisplayName || v.homeDisplayName)
    );
    const orderedGames = orderBy(tableBracketGames, 'divisionId');

    return (
      <section className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.gamesTitle}>Bracket Games</div>
          {orderedGames?.map((v, i) => this.renderGame(v, i))}
        </div>
        <div className={styles.rightColumn}>
          {event &&
          divisions &&
          pools &&
          teamCards &&
          games &&
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
              games={games}
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
