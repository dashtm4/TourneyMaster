import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './styles.module.scss';
import { ITeamCard } from 'common/models/schedule/teams';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';
import { Tooltip } from 'components/common';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';

interface Props {
  type: string;
  teamCard: ITeamCard;
  originGameId?: number;
  isEnterScores?: boolean;
  showHeatmap?: boolean;
}

const ERROR_ICON_STYLES = {
  flexShrink: 0,
  width: '17px',
  fill: '#FF0F19',
};

export default (props: Props) => {
  const { type, originGameId, showHeatmap, teamCard, isEnterScores } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { id: teamCard.id, type, originGameId },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

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
            style={{ color: showHeatmap ? '#f8f8f8' : 'gray' }}
          >
            {teamCard.name}&nbsp;({teamCard.divisionShortName})
          </span>
        </p>
      )}
      <p className={styles.cardOptionsWrapper}>
        {isEnterScores && (
          <label className={styles.scoresInputWrapper}>
            <input type="number" value="0" />
          </label>
        )}
        {!isEnterScores && (
          <button className={styles.lockBtn}>
            {getIcon(teamCard.isLocked ? Icons.LOCK : Icons.LOCK_OPEN, {
              fill: showHeatmap ? '#ffffff' : '#00A3EA',
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
      className={styles.cardContainer}
      style={{
        opacity: isDragging ? 0.8 : 1,
        backgroundColor: showHeatmap ? teamCard.divisionHex : '#fff',
      }}
    >
      {teamCard && renderTeamCard(teamCard)}
    </div>
  );
};
