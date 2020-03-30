import React, { useEffect, useState } from 'react';
import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
import { TableScheduleTypes } from 'common/enums';
import { getUnsatisfiedTeams, getSatisfiedTeams } from '../../helpers';
import Checkbox from 'components/common/buttons/checkbox';

interface IProps {
  tableType: TableScheduleTypes;
  teamCards: ITeamCard[];
  showHeatmap?: boolean;
  minGamesNum: number | null;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedList = (props: IProps) => {
  const { teamCards, onDrop, showHeatmap, tableType, minGamesNum } = props;
  const acceptType = 'teamdrop';

  const [unsatisfiedTeamCards, setUnsatisfiedTeamCards] = useState(teamCards);
  const [satisfiedTeamCards, setSatisfiedTeamCards] = useState<
    ITeamCard[] | undefined
  >(undefined);
  const [showAllTeams, setShowAllTeams] = useState(true);

  const onCheck = () => {
    setShowAllTeams(!showAllTeams);
  };

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

  useEffect(() => {
    const newUnsatisfiedTeamCards = getUnsatisfiedTeams(teamCards, minGamesNum);
    const newSatisfiedTeamCards = getSatisfiedTeams(teamCards, minGamesNum);
    setUnsatisfiedTeamCards(newUnsatisfiedTeamCards);
    setSatisfiedTeamCards(newSatisfiedTeamCards);
  }, [teamCards, showAllTeams]);

  return (
    <div
      className={styles.container}
      style={{ background: isOver ? '#fcfcfc' : '#ececec' }}
    >
      <h3 className={styles.title}>Needs Assignment</h3>
      <Checkbox
        options={[{ label: 'Show All Teams', checked: showAllTeams }]}
        onChange={onCheck}
      />
      <div ref={drop} className={styles.dropArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Games</th>
              <th>Team Name</th>
            </tr>
          </thead>
          <tbody>
            {unsatisfiedTeamCards.map((teamCard, ind) => (
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
            {!!(showAllTeams && unsatisfiedTeamCards.length) && (
              <tr className={styles.emptyRow}>
                <td />
                <td>Completed Teams</td>
              </tr>
            )}
            {showAllTeams &&
              satisfiedTeamCards?.map((teamCard, ind) => (
                <tr key={`tctr-${ind}`}>
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
