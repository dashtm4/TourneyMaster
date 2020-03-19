import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ITimeSlot from 'common/models/schedule/timeSlots';
import { selectProperGamesPerTimeSlot, IGame } from './helper';
import RenderFieldHeader from './field-header';
import RenderTimeSlot from './time-slot';
import { IField } from 'common/models/schedule/fields';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import './styles.scss';
import { IScheduleFacility } from 'common/models/schedule/facilities';

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.1,
  limitToWrapper: true,
};

interface IProps {
  games: IGame[];
  fields: IField[];
  timeSlots: ITimeSlot[];
  facilities: IScheduleFacility[];
  isHeatmap: boolean;
  isEnterScores?: boolean;
}

interface IPinchProps {
  zoomIn: BindingAction;
  zoomOut: BindingAction;
}

const SchedulesMatrix = (props: IProps) => {
  const {
    fields,
    timeSlots,
    games,
    facilities,
    isHeatmap,
    isEnterScores,
  } = props;

  const moveCard = () => null;

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
          options={{ ...TRANSFORM_WRAPPER_OPTIONS, disabled: false }}
        >
          {({ zoomIn, zoomOut }: IPinchProps) => (
            <>
              <p className={styles.zoomCntrols}>
                <button onClick={zoomIn}>
                  &#43;<span className="visually-hidden">Zoom in</span>
                </button>
                <button onClick={zoomOut}>
                  &#45;<span className="visually-hidden">Zoom out</span>
                </button>
              </p>
              <TransformComponent>
                <DndProvider backend={HTML5Backend}>
                  <table className={styles.table}>
                    <tbody>
                      <tr>
                        <td />
                        {fields.map((field: any) => (
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
                          isHeatmap={isHeatmap}
                          isEnterScores={isEnterScores}
                        />
                      ))}
                    </tbody>
                  </table>
                </DndProvider>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </section>
  );
};

export default SchedulesMatrix;
