import React from 'react';
import DropContainer, { IDropParams, MatrixTableDropEnum } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import SeedCard from '../dnd/seed';
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

  const {
    awayTeam,
    homeTeam,
    gameDate,
    isPlayoff,
    awaySeedId,
    homeSeedId,
    awayDisplayName,
    homeDisplayName,
    divisionName,
    divisionHex,
  } = game;

  const acceptType = [MatrixTableDropEnum.TeamDrop];

  if (isPlayoff) {
    acceptType.push(MatrixTableDropEnum.BracketDrop);
  }

  return (
    <td
      className={`${styles.gameSlotContainer} ${isPlayoff &&
        styles.gameSlotPlayoff}`}
    >
      <div className={styles.gameSlot}>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={1}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          <>
            {awayTeam && (
              <TeamDragCard
                tableType={tableType}
                type={MatrixTableDropEnum.TeamDrop}
                originGameId={game.id}
                originGameDate={gameDate}
                showHeatmap={showHeatmap}
                teamCard={awayTeam}
                onTeamCardUpdate={onTeamCardUpdate}
                isDndMode={isDndMode}
                isEnterScores={isEnterScores}
              />
            )}
            {(awaySeedId || awayDisplayName) && (
              <SeedCard
                showHeatmap={true}
                seedId={awaySeedId}
                displayName={awayDisplayName}
                divisionHex={divisionHex}
                divisionName={divisionName}
              />
            )}
          </>
        </DropContainer>
        <DropContainer
          acceptType={acceptType}
          gameId={game.id}
          position={2}
          onDrop={onDrop}
          teamCards={teamCards}
        >
          <>
            {homeTeam && (
              <TeamDragCard
                tableType={tableType}
                type={MatrixTableDropEnum.TeamDrop}
                originGameId={game.id}
                originGameDate={gameDate}
                showHeatmap={showHeatmap}
                teamCard={homeTeam}
                onTeamCardUpdate={onTeamCardUpdate}
                isDndMode={isDndMode}
                isEnterScores={isEnterScores}
              />
            )}
            {(homeSeedId || homeDisplayName) && (
              <SeedCard
                showHeatmap={true}
                seedId={homeSeedId}
                displayName={homeDisplayName}
                divisionHex={divisionHex}
                divisionName={divisionName}
              />
            )}
          </>
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
