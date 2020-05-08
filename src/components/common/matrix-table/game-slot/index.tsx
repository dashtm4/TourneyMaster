import React from 'react';
import DropContainer, { IDropParams, MatrixTableDropEnum } from '../dnd/drop';
import TeamDragCard from '../dnd/drag';
import SeedCard from '../dnd/seed';
import styles from '../styles.module.scss';
import { IGame } from '../helper';
import { ITeamCard } from 'common/models/schedule/teams';
import { TableScheduleTypes } from 'common/enums';
import chainIcon from 'assets/chainIcon.png';

interface Props {
  tableType: TableScheduleTypes;
  game: IGame;
  showHeatmap?: boolean;
  isDndMode: boolean;
  isEnterScores?: boolean;
  teamCards: ITeamCard[];
  highlightedGamedId?: number;
  simultaneousDnd?: boolean;
  onDrop: (dropParams: IDropParams) => void;
  onTeamCardUpdate: (teamCard: ITeamCard) => void;
  onGameUpdate: (game: IGame) => void;
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
    highlightedGamedId,
    onGameUpdate,
    simultaneousDnd,
  } = props;

  const {
    id,
    awayTeam,
    homeTeam,
    gameDate,
    isPlayoff,
    awaySeedId,
    homeSeedId,
    playoffRound,
    divisionName,
    divisionHex,
    awayDependsUpon,
    homeDependsUpon,
    bracketGameId,
    divisionId,
    playoffIndex,
    awayTeamId,
    homeTeamId,
    awayTeamScore,
    homeTeamScore,
  } = game;

  const acceptType = [MatrixTableDropEnum.TeamDrop];

  if (isPlayoff) {
    acceptType.push(MatrixTableDropEnum.BracketDrop);
  }

  const awayTeamName = teamCards.find(item => item.id === awayTeamId)?.name;
  const homeTeamName = teamCards.find(item => item.id === homeTeamId)?.name;

  return (
    <td
      className={`${styles.gameSlotContainer} ${isPlayoff &&
        styles.gameSlotPlayoff}`}
    >
      <div
        className={`${styles.gameSlot} ${highlightedGamedId === game.id &&
          styles.highlighted}`}
      >
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
            {!awayTeam && (awaySeedId || awayDependsUpon) && bracketGameId && (
              <SeedCard
                tableType={tableType}
                type={MatrixTableDropEnum.BracketDrop}
                position={1}
                round={playoffRound}
                showHeatmap={true}
                seedId={awaySeedId}
                teamId={awayTeamId}
                teamName={awayTeamName}
                teamScore={awayTeamScore}
                dependsUpon={awayDependsUpon}
                divisionHex={divisionHex}
                divisionName={divisionName}
                slotId={id}
                bracketGameId={bracketGameId}
                divisionId={divisionId!}
                playoffIndex={playoffIndex!}
                isEnterScores={isEnterScores}
                onGameUpdate={(changes: any) =>
                  onGameUpdate({ ...game, ...changes })
                }
              />
            )}
          </>
        </DropContainer>
        {!!simultaneousDnd && !!awayTeam && !!homeTeam && (
          <div
            className={styles.chainWrapper}
            style={{ backgroundColor: awayTeam?.divisionHex }}
          >
            <img
              src={chainIcon}
              style={{
                width: '18px',
                height: '18px',
              }}
              alt=""
            />
          </div>
        )}
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
            {!homeTeam && (homeSeedId || homeDependsUpon) && bracketGameId && (
              <SeedCard
                tableType={tableType}
                type={MatrixTableDropEnum.BracketDrop}
                position={2}
                round={playoffRound}
                dependsUpon={homeDependsUpon}
                showHeatmap={true}
                seedId={homeSeedId}
                teamId={homeTeamId}
                teamName={homeTeamName}
                teamScore={homeTeamScore}
                divisionHex={divisionHex}
                divisionName={divisionName}
                slotId={id}
                bracketGameId={bracketGameId}
                divisionId={divisionId!}
                playoffIndex={playoffIndex!}
                isEnterScores={isEnterScores}
                onGameUpdate={(changes: any) =>
                  onGameUpdate({ ...game, ...changes })
                }
              />
            )}
          </>
        </DropContainer>
      </div>
    </td>
  );
};

export default RenderGameSlot;
