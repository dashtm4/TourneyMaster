import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import styles from './styles.module.scss';
import './styles.scss';

const COLUMNS_COUNT = 15;
const ROWS_COUNT = 15;

const TRANSFORM_WRAPPER_OPTIONS = {
  minScale: 0.1,
  limitToWrapper: true,
};

interface Props {
  isEnterScores: boolean;
}

const ScoringTable = ({ isEnterScores }: Props) => {
  return (
    <section className={styles.section}>
      <h3 className="visually-hidden">Scoring table</h3>
      <div className={`scoring-table__table-wrapper ${styles.tableWrapper}`}>
        <TransformWrapper
          defaultPositionX={0.1}
          defaultPositionY={0.1}
          defaultScale={1}
          options={TRANSFORM_WRAPPER_OPTIONS}
        >
          <TransformComponent>
            <div className={styles.table}>
              {Array.from(new Array(COLUMNS_COUNT), (_, colIdx) => (
                <ul key={colIdx}>
                  {Array.from(new Array(ROWS_COUNT), (_, rowIdx) => (
                    <li className={styles.teamItem} key={rowIdx}>
                      Team # {colIdx + 1}
                      {isEnterScores && <input type="text" />}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </section>
  );
};

export default ScoringTable;
