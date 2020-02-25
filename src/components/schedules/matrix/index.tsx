import React, { useCallback, useState } from 'react';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { IField, ITeam, ITimeSlot } from '..';
import styles from './styles.module.scss';
import { IGame, defineGames, IDefinedGames } from './helper';
import GameDrop from './dnd/drop';

interface IProps {
  timeSlots: ITimeSlot[];
  fields: IField[];
  teams: ITeam[];
}

const renderFieldHeader = (field: IField) => (
  <th key={field.id} className={styles.fieldTh}>
    {field.name}
  </th>
);

const renderGameSlot = (game: IGame, moveCard: any) => (
  <td key={game.id}>
    <div className={styles.gameSlot}>
      <GameDrop
        accept="teamdrop"
        // index={game.awayTeam?.id || game.id}
        id={game.awayTeam?.id || game.id}
        text={game.awayTeam?.name!}
        onDrop={moveCard}
      />
      <GameDrop
        accept="teamdrop"
        // index={game.homeTeam?.id || game.id + 1000}
        id={game.homeTeam?.id || game.id + 1000}
        text={game.homeTeam?.name!}
        onDrop={moveCard}
      />
    </div>
  </td>
);

const renderTimeSlot = (timeSlot: ITimeSlot, games: IGame[], moveCard: any) => (
  <tr key={timeSlot.id} className={styles.timeSlotRow}>
    <th>{timeSlot.time}</th>
    {games.map((game: IGame) => renderGameSlot(game, moveCard))}
  </tr>
);

const selectProperGamesPerTimeSlot = (timeSlot: ITimeSlot, games: IGame[]) =>
  games.filter((game: IGame) => game.timeSlotId === timeSlot.id);

const SchedulesMatrix = (props: IProps) => {
  const { fields, timeSlots, teams } = props;
  const definedGames: IDefinedGames = defineGames(fields, timeSlots, teams);
  const { gameFields } = definedGames;
  // console.log('DefinedGames:', gameFields, gameTimeSlots, definedGames.games);

  const [teamCards, setTeamCards] = useState(teams);

  const moveCard = useCallback(
    (dragIndex: any, hoverIndex: number) => {
      console.log('moveCard', dragIndex, hoverIndex);
      const dragCard = teamCards[dragIndex.id];
      const updatedCards = update(teamCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      });

      setTeamCards(updatedCards);
      console.log('teamCards:', teamCards);
    },
    [teamCards]
  );

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td />
          {fields
            .slice(0, gameFields)
            .map((field: any) => renderFieldHeader(field))}
        </tr>
        <DndProvider backend={HTML5Backend}>
          {timeSlots.map((timeSlot: ITimeSlot) =>
            renderTimeSlot(
              timeSlot,
              selectProperGamesPerTimeSlot(timeSlot, definedGames.games),
              moveCard
            )
          )}
        </DndProvider>
      </tbody>
    </table>
  );
};

export default SchedulesMatrix;
