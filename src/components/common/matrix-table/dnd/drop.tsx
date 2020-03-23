import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './styles.module.scss';

export interface IDropParams {
  teamId: string;
  position: number | undefined;
  gameId: number | undefined;
  originGameId?: number;
}

interface IProps {
  acceptType: string;
  gameId: number;
  position: 1 | 2;
  children?: React.ReactElement;
  onDrop: (dropParams: IDropParams) => void;
}

const DropContainer = (props: IProps) => {
  const { acceptType, onDrop, children } = props;

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    drop: (item: any) => {
      onDrop({
        teamId: item.id,
        position: props.position,
        gameId: props.gameId,
        originGameId: item.originGameId,
      });
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={styles.dropContainer}
      style={{ opacity: isOver ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

export default DropContainer;
