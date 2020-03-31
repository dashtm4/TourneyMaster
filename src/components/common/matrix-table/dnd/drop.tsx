import React from 'react';
import { useDrop } from 'react-dnd';
import styles from './styles.module.scss';
import { ITeamCard } from 'common/models/schedule/teams';

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
  teamCards: ITeamCard[];
}

const DropContainer = (props: IProps) => {
  const { acceptType, onDrop, children, gameId, teamCards } = props;

  const isTeamLocked = teamCards
    .map(team => team.games)
    .flat()
    .filter(
      (game: { id: number; position: number; isTeamLocked: boolean }) =>
        game.id === gameId
    )
    .filter(
      (game: { id: number; teamPosition: number; isTeamLocked: boolean }) =>
        game.teamPosition === props.position
    )[0]?.isTeamLocked;

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
    }),
    canDrop: () => !isTeamLocked,
  });

  return (
    <div
      ref={drop}
      className={styles.dropContainer}
      style={{ opacity: isOver && !isTeamLocked ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
};

export default DropContainer;
