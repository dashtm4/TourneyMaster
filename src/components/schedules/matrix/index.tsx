import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { IField } from 'common/models/schedule/fields';
import { ITeam } from 'common/models/schedule/teams';
import { ITimeSlot } from '..';
import { selectProperGamesPerTimeSlot } from './helper';
import TeamCard from './dnd/drag';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import styles from './styles.module.scss';
import { IGameOptions } from './Scheduler';
import { ISchedulerResult } from '..';

interface IProps {
  timeSlots: ITimeSlot[];
  fields: IField[];
  teams: ITeam[];
  gameOptions?: IGameOptions;
  scheduling: ISchedulerResult;
}

const SchedulesMatrix = (props: IProps) => {
  const { scheduling } = props;
  const { fields, gameFields, timeSlots, teamCards, updatedGames } = scheduling;

  const moveCard = () => null;

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
              fields={fields}
              games={selectProperGamesPerTimeSlot(timeSlot, updatedGames)}
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
