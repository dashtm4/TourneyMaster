import React from 'react';
import { useDrag } from 'react-dnd';
import { find } from 'lodash-es';
import { ITeamCard } from 'common/models/schedule/teams';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';
import { Tooltip } from 'components/common';
import { getIcon } from 'helpers';
import { Icons, TableScheduleTypes } from 'common/enums';
import { IInputEvent } from 'common/types';
import cancelIcon from 'assets/canceled.png';
import styles from './styles.module.scss';
import { getContrastingColor } from '../helper';
import { IGame } from '../helper';

interface Props {
  tableType: TableScheduleTypes;
  type: string;
  teamCard: ITeamCard;
  originGameId?: number;
  originGameDate?: string;
  isEnterScores?: boolean;
  showHeatmap?: boolean;
  onTeamCardUpdate?: (teamCard: ITeamCard) => void;
  isDndMode?: boolean;
  game?: IGame;
}

const ERROR_ICON_STYLES = {
  flexShrink: 0,
  width: '17px',
  fill: '#FF0F19',
};

export default (props: Props) => {
  const {
    tableType,
    type,
    originGameId,
    originGameDate,
    showHeatmap,
    teamCard,
    isEnterScores,
    onTeamCardUpdate,
    isDndMode,
    game
  } = props;

  const gameFromTeamCard = find(teamCard.games, { id: originGameId, date: originGameDate });
  const isTeamLocked = gameFromTeamCard?.isTeamLocked;
  const isBracketTable = tableType === TableScheduleTypes.BRACKETS;

  const isDraggable = !isTeamLocked && !isBracketTable;

  const [{ isDragging }, drag] = useDrag({
    item: { id: teamCard.id, type, possibleGame: game, originGameId, originGameDate },
    canDrag: isDraggable,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const onLockClick = () => {
    onTeamCardUpdate!({
      ...teamCard,
      games: teamCard.games?.map(item =>
        item.id === originGameId && item.date === originGameDate
          ? { ...item, isTeamLocked: !item.isTeamLocked }
          : item
      ),
    });
  };

  const onChangeScore = ({ target: { value } }: IInputEvent) => {
    onTeamCardUpdate!({
      ...teamCard,
      games: teamCard.games?.map(game =>
        game.id === originGameId && game.date === originGameDate
          ? { ...game, teamScore: value }
          : game
      ),
    });
  };

  const renderTeamCardErrors = (teamCard: ITeamCard) => (
    <Tooltip
      title={teamCard?.errors?.join(';')!}
      type={TooltipMessageTypes.WARNING}
    >
      <p className={styles.cardNameWrapper}>
        <span
          className={`${styles.cardTextWrapper} ${styles.cardTextWrapperError}`}
        >
          {teamCard.name}({teamCard.divisionShortName})
        </span>
        {getIcon(Icons.ERROR, ERROR_ICON_STYLES)}
      </p>
    </Tooltip>
  );

  const renderTeamCard = (teamCard: ITeamCard) => (
    <>
      {teamCard.errors?.length && renderTeamCardErrors(teamCard)}
      {!teamCard.errors?.length && (
        <p className={styles.cardNameWrapper}>
          <span
            className={styles.cardTextWrapper}
            style={{
              color:
                showHeatmap && teamCard.divisionHex
                  ? getContrastingColor(teamCard.divisionHex)
                  : 'gray',
            }}
          >
            {teamCard.name}&nbsp;({teamCard.divisionShortName})
          </span>
        </p>
      )}
      <p className={styles.cardOptionsWrapper}>
        {tableType === TableScheduleTypes.SCORES && (
          <label className={styles.scoresInputWrapper}>
            <input
              onChange={onChangeScore}
              value={gameFromTeamCard?.teamScore || ''}
              type="number"
              min="0"
              style={{
                color: isEnterScores
                  ? '#000000'
                  : getContrastingColor(teamCard.divisionHex),
                backgroundColor: isEnterScores ? '#ffffff' : '',
              }}
              readOnly={!isEnterScores}
            />
          </label>
        )}
        {tableType === TableScheduleTypes.SCHEDULES && originGameId && (
          <button className={styles.lockBtn} onClick={onLockClick}>
            {getIcon(gameFromTeamCard?.isTeamLocked ? Icons.LOCK : Icons.LOCK_OPEN, {
              fill: showHeatmap && teamCard.divisionHex ? '#ffffff' : '#00A3EA',
            })}
            <span className="visually-hidden">Unlock/Lock team</span>
          </button>
        )}
      </p>
    </>
  );

  return (
    <div
      ref={drag}
      className={`${styles.cardContainer} ${isDndMode &&
        !isDraggable &&
        styles.isLocked}`}
      style={{
        opacity: isDragging ? 0.8 : 1,
        backgroundColor: showHeatmap ? teamCard.divisionHex : '#fff',
      }}
    >
      {teamCard && renderTeamCard(teamCard)}
      {gameFromTeamCard?.isCancelled && (
        <img
          className={styles.cancelIcon}
          src={cancelIcon}
          width="60"
          height="22"
          alt="Cancel icon"
        />
      )}
    </div>
  );
};
