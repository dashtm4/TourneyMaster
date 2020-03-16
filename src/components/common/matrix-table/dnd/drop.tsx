import React from 'react';
import { useDrop } from 'react-dnd';
import { ITeamCard } from 'common/models/schedule/teams';
import { Tooltip } from 'components/common';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';
import styles from './styles.module.scss';

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
}

export default (props: Props) => {
  const { team, accept, onDrop, fieldId, timeSlotId, teamPosition } = props;

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
        team.hasErrors ? styles.cardContainerError : ''
      }`}
      style={{
        opacity: isActive ? 0.3 : 1,
        background: isActive ? '#343434' : 'initial',
      }}
    >
      {team.hasErrors ? (
        <Tooltip
          title={`${team.name}(${team.divisionShortName}) cannot play at this time.`}
          type={TooltipMessageTypes.WARNING}
        >
          <p className={styles.cardNameWrapper}>
            {team.name}({team.divisionShortName})
          </p>
        </Tooltip>
      ) : (
        <p className={styles.cardNameWrapper}>
          {team.name}({team.divisionShortName})
        </p>
      )}
      <p className={styles.cardOptionsWrapper}>
        <button>1</button>
      </p>
    </div>
  );
};
