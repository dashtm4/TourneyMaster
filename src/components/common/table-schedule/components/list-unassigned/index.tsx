import React from 'react';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
import { TableScheduleTypes } from 'common/enums';

interface IProps {
  tableType: TableScheduleTypes;
  teamCards: ITeamCard[];
  showHeatmap?: boolean;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedList = (props: IProps) => {
  const { teamCards, onDrop, showHeatmap, tableType } = props;
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
                    tableType={tableType}
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
