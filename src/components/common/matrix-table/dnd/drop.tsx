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

  return (
    <div
      ref={drop}
      className={`${styles.cardContainer} ${
        team.errors ? styles.cardContainerError : ''
      } ${isHeatmap ? styles.cardContainerHeatmap : ''}`}
      style={{
        opacity: isActive ? 0.3 : '',
        background: isActive ? '#343434' : '',
        backgroundColor: isHeatmap ? team.divisionHex : '',
      }}
    >
      {team.errors ? (
        <Tooltip
          title={team.errors.join(';')}
          type={TooltipMessageTypes.WARNING}
        >
          <p className={styles.cardNameWrapper}>
            <span
              className={`${styles.cardTextWrapper} ${styles.cardTextWrapperError}`}
            >
              {team.name}({team.divisionShortName})
            </span>
            {getIcon(Icons.ERROR, ERROR_ICON_STYLES)}
          </p>
        </Tooltip>
      ) : (
        <p className={styles.cardNameWrapper}>
          <span className={styles.cardTextWrapper}>
            {team.name}({team.divisionShortName})
          </span>
        </p>
      )}
      <p className={styles.cardOptionsWrapper}>
        <button className={styles.lockBtn}>
          {getIcon(team.isLocked ? Icons.LOCK : Icons.LOCK_OPEN, {
            fill: isHeatmap ? '#ffffff' : '#00A3EA',
          })}
          <span className="visually-hidden">Unlock/Lock team</span>
        </button>
      </p>
    </div>
  );
};
