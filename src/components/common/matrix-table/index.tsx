import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { selectProperGamesPerTimeSlot, IGame } from './helper';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import { IField } from 'common/models/schedule/fields';
import styles from './styles.module.scss';
import './styles.scss';
import { IScheduleFacility } from 'common/models/schedule/facilities';
import { IDropParams } from './dnd/drop';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.1,
  limitToWrapper: true,
};

interface IProps {
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  disableZooming: boolean;
  moveCard: (dropParams: IDropParams) => void;
  showHeatmap: boolean;
  isEnterScores?: boolean;
}

const SchedulesMatrix = (props: IProps) => {
  const {
    fields,
    timeSlots,
    games,
    facilities,
    showHeatmap,
    isEnterScores,
    moveCard,
    disableZooming,
  } = props;

  const takeFacilityByFieldId = (facilityId: string) =>
    facilities.find(facility => facility.id === facilityId);

  return (
    <section className={styles.section}>
      <h3 className="visually-hidden">Table</h3>
      <div className={`matrix-table__table-wrapper ${styles.tableWrapper}`}>
        <TransformWrapper
          defaultPositionX={0.01}
          defaultPositionY={0.01}
          defaultScale={1}
          options={{ ...TRANSFORM_WRAPPER_OPTIONS, disabled: disableZooming }}
        >
          <TransformComponent>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td />
                  {fields
                    .filter(field => !field.isUnused)
                    .map((field: IField) => (
                      <RenderFieldHeader
                        key={field.id}
                        field={field}
                        facility={takeFacilityByFieldId(field.facilityId)}
                      />
                    ))}
                </tr>
                {timeSlots.map((timeSlot: ITimeSlot) => (
                  <RenderTimeSlot
                    key={timeSlot.id}
                    timeSlot={timeSlot}
                    fields={fields}
                    games={selectProperGamesPerTimeSlot(timeSlot, games)}
                    moveCard={moveCard}
                    showHeatmap={showHeatmap}
                    isEnterScores={isEnterScores}
                  />
                ))}
              </tbody>
            </table>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default SchedulesMatrix;
