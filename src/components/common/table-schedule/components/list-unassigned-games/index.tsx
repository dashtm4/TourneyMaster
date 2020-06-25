/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
// import { ITeamCard } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
// import TeamDragCard from 'components/common/matrix-table/dnd/drag';
import { useDrop } from 'react-dnd';
import { IDropParams } from 'components/common/matrix-table/dnd/drop';
// import { TableScheduleTypes } from 'common/enums';
// import { getUnsatisfiedTeams, getSatisfiedTeams } from '../../helpers';
import Checkbox from 'components/common/buttons/checkbox';
// import { TableSortLabel } from '@material-ui/core';
// import { orderBy } from 'lodash-es';
import { IEventDetails } from 'common/models'; // IPool, 
// import { calculateTournamentDays } from 'helpers';
import { IGame } from 'components/common/matrix-table/helper';
import GameDragCard from './dnd/game-drag';

interface IProps {
  event: IEventDetails;
  games: IGame[];
  // pools: IPool[];
  // tableType: TableScheduleTypes;
  // teamCards: ITeamCard[];
  showHeatmap?: boolean;
  // minGamesNum: number | null;
  onDrop: (dropParams: IDropParams) => void;
}

const UnassignedGamesList = (props: IProps) => {
  const {
    games,
    // teamCards,
    onDrop,
    showHeatmap,
    // tableType,
    // minGamesNum,
    // pools,
  } = props;
  const acceptType = 'teamdrop';
  // const [unsatisfiedTeamCards, setUnsatisfiedTeamCards] = useState(teamCards);
  // const [satisfiedTeamCards, setSatisfiedTeamCards] = useState<
  //   ITeamCard[] | undefined
  // >(undefined);
  const [showAllTeams, setShowAllTeams] = useState(true);
  // const [showPools, setShowPools] = useState(true);
  // const [sortBy, setSortBy] = useState('');
  // const [sortOrder, setSortOrder] = useState('desc');

  // const sortData = (by: string) => {
  //   setSortBy(by);
  //   setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  //   setUnsatisfiedTeamCards(
  //     orderBy(
  //       unsatisfiedTeamCards,
  //       ['divisionShortName', by],
  //       ['asc', sortOrder === 'asc' ? 'asc' : 'desc']
  //     )
  //   );
  //   setSatisfiedTeamCards(
  //     orderBy(
  //       satisfiedTeamCards,
  //       ['divisionShortName', by],
  //       ['asc', sortOrder === 'asc' ? 'asc' : 'desc']
  //     )
  //   );
  // };

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
        possibleGame: item.possibleGame,
        originGameId: item.originGameId,
        originGameDate: item.originGameDate,
      });
    },
  });

  // useEffect(() => {
  //   const daysNum = calculateTournamentDays(props.event).length;
  //   const newUnsatisfiedTeamCards = getUnsatisfiedTeams(
  //     teamCards,
  //     minGamesNum,
  //     daysNum
  //   );
  //   const newSatisfiedTeamCards = getSatisfiedTeams(
  //     teamCards,
  //     minGamesNum,
  //     daysNum
  //   );

  //   const orderedUnsatisfiedTeamCards = orderBy(
  //     newUnsatisfiedTeamCards,
  //     ['divisionShortName', sortBy],
  //     ['asc', sortOrder === 'asc' ? 'desc' : 'asc']
  //   );
  //   const orderedSatisfiedTeamCards = orderBy(
  //     newSatisfiedTeamCards,
  //     ['divisionShortName', sortBy],
  //     ['asc', sortOrder === 'asc' ? 'desc' : 'asc']
  //   );

  //   setUnsatisfiedTeamCards(orderedUnsatisfiedTeamCards);
  //   setSatisfiedTeamCards(orderedSatisfiedTeamCards);
  // }, [teamCards, showAllTeams]);

  return (
    <div
      className={styles.container}
      style={{ background: isOver ? '#fcfcfc' : '#ececec' }}
    >
      <h3 className={styles.title}>Needs Assignment</h3>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          options={[{ label: 'All Teams', checked: showAllTeams }]}
          onChange={onCheck}
        />
        {/* <Checkbox
          options={[{ label: 'Show Pools', checked: showPools }]}
          onChange={() => setShowPools(!showPools)}
        /> */}
      </div>
      <div ref={drop} className={styles.dropArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Games</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, ind) => (
              <tr key={`tr-${ind}`}>
                <td>
                  <GameDragCard
                    showHeatmap={showHeatmap}
                    key={ind}
                    game={game}
                    // teamCards={teamCards}
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

export default UnassignedGamesList;
