import React from 'react';
import { getContrastingColor, IGame } from '../helper';
import { useDrag } from 'react-dnd';
import { TableScheduleTypes } from 'common/enums';
import cancelIcon from 'assets/canceled.png';
import styles from './styles.module.scss';

interface Props {
  tableType: TableScheduleTypes;
  position: 1 | 2;
  seedId?: number;
  teamId?: string;
  round?: number;
  showHeatmap: boolean;
  divisionId: string;
  divisionHex?: string;
  divisionName?: string;
  playoffIndex: number;
  dependsUpon?: number;
  slotId: number;
  bracketGameId: string;
  type: string;
  teamName?: string;
  teamScore?: number;
  isCancelled?: boolean;
  isEnterScores?: boolean;
  onGameUpdate: (gameChanges: Partial<IGame>) => void;
}

export const getDisplayName = (round?: number, depends?: number) => {
  if (!round || !depends) return;
  const key = round >= 0 ? 'Winner' : 'Loser';
  return `${key} Game ${depends}`;
};

export default (props: Props) => {
  const {
    position,
    seedId,
    teamId,
    showHeatmap,
    divisionId,
    divisionHex,
    divisionName,
    round,
    playoffIndex,
    dependsUpon,
    type,
    bracketGameId,
    teamName,
    teamScore,
    isEnterScores,
    isCancelled,
    onGameUpdate,
    tableType,
  } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { id: bracketGameId, type, divisionId, playoffIndex },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const positionedTeam = position === 1 ? 'awayTeamScore' : 'homeTeamScore';

  const onChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGameUpdate({
      [positionedTeam]: Number(e.target.value),
    });
  };

  const renderScoringInput = () => (
    <p className={styles.cardOptionsWrapper}>
      <label className={styles.scoresInputWrapper}>
        <input
          onChange={onChangeScore}
          value={teamScore}
          type="number"
          min="0"
          style={{
            color: isEnterScores ? '#000000' : getContrastingColor(divisionHex),
            backgroundColor: isEnterScores ? '#ffffff' : '',
          }}
          readOnly={!isEnterScores}
        />
      </label>
    </p>
  );
  return (
    <div
      ref={drag}
      className={`${styles.seedContainer} ${
        position === 1 ? styles.seedContainerTop : styles.seedContainerBottom
      } ${showHeatmap && styles.heatmap}`}
      style={{
        background: divisionHex ? `#${divisionHex}` : '#fff',
        color: getContrastingColor(divisionHex),
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      <span className={styles.seedName}>
        {teamName
          ? `${teamName} (${divisionName})`
          : seedId
          ? `Seed ${seedId} (${divisionName})`
          : getDisplayName(round, dependsUpon)}
      </span>
      {tableType === TableScheduleTypes.SCORES &&
        teamId &&
        renderScoringInput()}
      {isCancelled && (
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
