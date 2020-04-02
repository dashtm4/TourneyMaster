import React from 'react';
import DropContainer, { IDropParams } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import styles from '../styles.module.scss';
import { IGame } from '../helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { TableScheduleTypes } from 'common/enums';

interface Props {
  tableType: TableScheduleTypes;
  game: IGame;
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  isDndMode: boolean;
  isEnterScores?: boolean;
  teamCards: ITeamCard[];
}

const RenderGameSlot = (props: Props) => {
  const {
    tableType,
    game,
    onDrop,
    showHeatmap,
    onTeamCardUpdate,
    isDndMode,
    isEnterScores,
    teamCards,
  } = props;
  const { awayTeam, homeTeam } = game;
  const acceptType = 'teamdrop';

  return (
    <td className={styles.gameSlotContainer}>
      <div className={styles.gameSlot}>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={1}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          {awayTeam && (
            <TeamDragCard
              tableType={tableType}
              type={acceptType}
              originGameId={game.id}
              showHeatmap={showHeatmap}
              teamCard={awayTeam}
              onTeamCardUpdate={onTeamCardUpdate}
              isDndMode={isDndMode}
              isEnterScores={isEnterScores}
            />
          )}
        </DropContainer>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={2}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          {homeTeam && (
            <TeamDragCard
              tableType={tableType}
              type={acceptType}
              originGameId={game.id}
              showHeatmap={showHeatmap}
              teamCard={homeTeam}
              onTeamCardUpdate={onTeamCardUpdate}
              isDndMode={isDndMode}
              isEnterScores={isEnterScores}
            />
          )}
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
