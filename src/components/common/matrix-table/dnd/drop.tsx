import React from 'react';
import { useDrop } from 'react-dnd';
import { ITeamCard } from 'common/models/schedule/teams';
import { getIcon } from 'helpers';
import { Tooltip } from 'components/common';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';
import { Icons } from 'common/enums';
import styles from './styles.module.scss';

const ERROR_ICON_STYLES = {
  flexShrink: 0,
  width: '17px',
  fill: '#FF0F19',
};

interface OnDropData {
  id: string;
  text: string;
  type: string;
}

export interface DropParams extends OnDropData {
  fieldId: string;
  timeSlotId: number;
  teamPosition: number;
}

interface Props {
  team: ITeamCard;
  accept: string;
  onDrop: (params: DropParams) => void;
  fieldId: string;
  timeSlotId: number;
  teamPosition: 1 | 2;
  isHeatmap?: boolean;
  isEnterScores?: boolean;
}

export default (props: Props) => {
  const {
    team,
    accept,
    onDrop,
    fieldId,
    timeSlotId,
    teamPosition,
    isHeatmap,
    isEnterScores,
  } = props;

  const onDropFunc = (data: OnDropData) => {
    onDrop({
      ...data,
      fieldId,
      timeSlotId,
      teamPosition,
    });
  };

  const [dropItem, drop] = useDrop({
    accept,
    drop: onDropFunc,
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const { isOver, canDrop } = dropItem;
  const isActive = isOver && canDrop;

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
          <span className={styles.cardTextWrapper}>
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
              fill: isHeatmap ? '#ffffff' : '#00A3EA',
            })}
            <span className="visually-hidden">Unlock/Lock team</span>
          </button>
        )}
      </p>
    </>
  );

  return (
    <div
      ref={drop}
      className={`${styles.cardContainer} ${
        team?.errors ? styles.cardContainerError : ''
      } ${isHeatmap ? styles.cardContainerHeatmap : ''}`}
      style={{
        opacity: isActive ? 0.3 : '',
        background: isActive ? '#343434' : '',
        backgroundColor: isHeatmap ? team?.divisionHex || '' : '',
      }}
    >
      {team && renderTeamCard(team)}
    </div>
  );
};
