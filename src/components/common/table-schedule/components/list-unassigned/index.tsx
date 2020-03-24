import React from 'react';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';

interface IProps {
  teamCards: ITeamCard[];
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedList = (props: IProps) => {
  const { teamCards, onDrop, showHeatmap } = props;
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
      <h3 className={styles.title}>
        Needs Assignment {showHeatmap ? 'true' : 'false'}
      </h3>
      <div ref={drop} className={styles.dropArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Games</th>
              <th>Team Name</th>
            </tr>
          </thead>
          <tbody>
            {teamCards.map((teamCard, ind) => (
              <tr key={`tr-${ind}`}>
                <td className={styles.gamesNum}>{teamCard.games?.length}</td>
                <td>
                  <TeamDragCard
                    showHeatmap={showHeatmap}
                    key={ind}
                    teamCard={teamCard}
                    type={acceptType}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnassignedList;
