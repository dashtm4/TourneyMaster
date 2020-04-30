import React from 'react';
import moment from 'moment';
import styles from './styles.module.scss';
import SeedDrop from '../dnd/drop';
import Seed from '../dnd/seed';
import { IBracketGame, IBracketSeed } from '../bracketGames';
import { formatTimeSlot, getIcon } from 'helpers';
import { Button } from 'components/common';
import { Icons } from 'common/enums';
import { SeedsContext } from 'components/playoffs/brackets';

interface IProps {
  game: IBracketGame;
  onDrop: any;
  seedRound?: boolean;
  onRemove: (gameIndex: number) => void;
}

const BracketGameSlot = (props: IProps) => {
  const { game, onDrop, seedRound, onRemove } = props;
  const time = formatTimeSlot(game?.startTime || '');
  const date = moment(game?.gameDate).format('MM/DD/YYYY');

  const getDisplayName = (round?: number, depends?: number) => {
    if (round === undefined || !depends) return;
    const key = round > 0 ? 'Winner' : 'Loser';
    return `${key} Game ${depends}`;
  };

  const onRemovePressed = () => {
    onRemove(game.index);
  };

  const getSeedData = (game: IBracketGame, seeds?: IBracketSeed[]) => {
    const awaySeed = seeds?.find(
      seed => seed.teamId === game.awayTeamId || seed.id === game.awaySeedId
    );
    const homeSeed = seeds?.find(
      seed => seed.teamId === game.homeTeamId || seed.id === game.homeSeedId
    );

    return {
      awayTeamId: awaySeed?.teamId,
      awayTeamName: awaySeed?.teamName,
      homeTeamId: homeSeed?.teamId,
      homeTeamName: homeSeed?.teamName,
    };
  };

  return (
    <div className={`${styles.bracketGame} ${game?.hidden && styles.hidden}`}>
      <SeedsContext.Consumer>
        {seeds => (
          <>
            <SeedDrop
              id={game?.index}
              position={1}
              type="seed"
              onDrop={onDrop}
              placeholder={
                !seedRound && !game.awayTeamId
                  ? getDisplayName(game.round, game.awayDependsUpon)
                  : ''
              }
            >
              {game?.awaySeedId || game?.awayTeamId ? (
                <Seed
                  seedId={game?.awaySeedId}
                  name={String(game?.awaySeedId)}
                  teamId={getSeedData(game, seeds).awayTeamId}
                  teamName={getSeedData(game, seeds).awayTeamName}
                  type="seed"
                  dropped={true}
                />
              ) : (
                undefined
              )}
            </SeedDrop>
            <div className={styles.bracketGameDescription}>
              <div className={styles.descriptionInfo}>
                {game.fieldId && game.startTime ? (
                  <>
                    <span>{`Game ${game?.index}:  ${game?.fieldName}`}</span>
                    <span>{`${time}, ${date}`}</span>
                  </>
                ) : (
                  <>
                    <span>{`Game ${game?.index}`}</span>
                    <span>Unassigned Game</span>
                  </>
                )}
              </div>
              <div className={styles.bracketManage}>
                {game.awaySeedId || game.homeSeedId ? null : (
                  <Button
                    label={getIcon(Icons.DELETE)}
                    variant="text"
                    color="default"
                    onClick={onRemovePressed}
                  />
                )}
              </div>
            </div>
            <SeedDrop
              id={game?.index}
              position={2}
              type="seed"
              onDrop={onDrop}
              placeholder={
                !seedRound && !game.homeTeamId
                  ? getDisplayName(game.round, game.homeDependsUpon)
                  : ''
              }
            >
              {game?.homeSeedId || game?.homeTeamId ? (
                <Seed
                  seedId={game?.homeSeedId}
                  name={String(game?.homeSeedId)}
                  teamId={getSeedData(game, seeds).homeTeamId}
                  teamName={getSeedData(game, seeds).homeTeamName}
                  type="seed"
                  dropped={true}
                />
              ) : (
                undefined
              )}
            </SeedDrop>
          </>
        )}
      </SeedsContext.Consumer>
    </div>
  );
};

export default BracketGameSlot;
