import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './styles.module.scss';

interface OnDropData {
  id: number;
  text: string;
  type: string;
}

export interface DropParams extends OnDropData {
  fieldId: number;
  timeSlotId: number;
  teamPosition: number;
}

interface Props {
  text: string;
  accept: string;
  id: number;
  onDrop: (params: DropParams) => void;
  fieldId: number;
  timeSlotId: number;
  teamPosition: 1 | 2;
}

export default (props: Props) => {
  const { text, accept, onDrop, fieldId, timeSlotId, teamPosition } = props;

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
      className={styles.cardContainer}
      style={{
        opacity: isActive ? 0.3 : 1,
        background: isActive ? '#343434' : 'initial',
      }}
    >
      {text}
    </div>
  );
};
