import React from 'react';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';

interface IProps {
  teamCards: ITeamCard[];
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedList = (props: IProps) => {
  const { teamCards, onDrop } = props;
  const acceptType = 'teamdrop';

  const [{ isOver }, drop] = useDrop({
    accept: acceptType,
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
    drop: (item: any) => {
      onDrop({
        gameId: undefined,
        position: undefined,
        teamId: item.id,
        originGameId: item.originGameId,
      });
    },
  });

  return (
    <div
      className={styles.container}
      style={{ background: isOver ? '#fcfcfc' : '#ececec' }}
    >
      <h3 className={styles.title}>Needs Assignment</h3>
      <div ref={drop} className={styles.dropArea}>
        {teamCards.map((teamCard, ind) => (
          <TeamDragCard key={ind} teamCard={teamCard} type={acceptType} />
        ))}
      </div>
    </div>
  );
};

export default UnassignedList;
