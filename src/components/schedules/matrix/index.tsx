import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { IField, ITeam, ITimeSlot } from '..';
import {
  defineGames,
  IDefinedGames,
  updateTeamCards,
  selectProperGamesPerTimeSlot,
} from './helper';
import TeamCard from './dnd/drag';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import { DropParams } from './dnd/drop';
import styles from './styles.module.scss';
import Scheduler from './scheduler';

export interface ITeamCard extends ITeam {
  fieldId?: number;
  timeSlotId?: number;
  teamPosition?: number;
}

interface IProps {
  timeSlots: ITimeSlot[];
  fields: IField[];
  teams: ITeam[];
}

const SchedulesMatrix = (props: IProps) => {
  const { fields, timeSlots, teams } = props;
  const [teamCards, setTeamCards] = useState<ITeamCard[]>(teams);

  const definedGames: IDefinedGames = defineGames(fields, timeSlots, teams);
  const { gameFields, games } = definedGames;

  const moveCard = useCallback(
    (params: DropParams) => setTeamCards(updateTeamCards(params, teamCards)),
    [teamCards]
  );

  const values = new Scheduler(fields, teamCards, games, timeSlots);
  console.log('values', values);

  return (
    <DndProvider backend={HTML5Backend}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td />
            {fields.slice(0, gameFields).map((field: any) => (
              <RenderFieldHeader key={field.id} field={field} />
            ))}
          </tr>
          {timeSlots.map((timeSlot: ITimeSlot) => (
            <RenderTimeSlot
              key={timeSlot.id}
              timeSlot={timeSlot}
              games={selectProperGamesPerTimeSlot(
                timeSlot,
                values.updatedGames
              )}
              moveCard={moveCard}
            />
          ))}
        </tbody>
      </table>
      {teamCards.map((card: ITeam) => (
        <TeamCard type="teamdrop" text={card.name} id={card.id} key={card.id} />
      ))}
    </DndProvider>
  );
};

export default SchedulesMatrix;
