import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { IField } from 'common/models/schedule/fields';
import { ITimeSlot } from 'components/schedules';
import { selectProperGamesPerTimeSlot, IGame } from './helper';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import styles from './styles.module.scss';
import './styles.scss';

interface IProps {
  fields: IField[];
  games: IGame[];
  timeSlots: ITimeSlot[];
  isHeatmap: boolean;
  isEnterScores?: boolean;
}

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.1,
  limitToWrapper: true,
};

const SchedulesMatrix = (props: IProps) => {
  const { fields, timeSlots, games, isHeatmap, isEnterScores } = props;

  const moveCard = () => null;

  return (
    <section className={styles.section}>
      <h3 className="visually-hidden">Table</h3>
      <div className={`matrix-table__table-wrapper ${styles.tableWrapper}`}>
        <TransformWrapper
          defaultPositionX={0.1}
          defaultPositionY={0.1}
          defaultScale={1}
          options={TRANSFORM_WRAPPER_OPTIONS}
        >
          <TransformComponent>
            <DndProvider backend={HTML5Backend}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td />
                    {fields.map((field: any) => (
                      <RenderFieldHeader key={field.id} field={field} />
                    ))}
                  </tr>
                  {timeSlots.map((timeSlot: ITimeSlot) => (
                    <RenderTimeSlot
                      key={timeSlot.id}
                      timeSlot={timeSlot}
                      fields={fields}
                      games={selectProperGamesPerTimeSlot(timeSlot, games)}
                      moveCard={moveCard}
                      isHeatmap={isHeatmap}
                      isEnterScores={isEnterScores}
                    />
                  ))}
                </tbody>
              </table>
            </DndProvider>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default SchedulesMatrix;
