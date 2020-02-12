import React from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import GroupItem from '../group-item';
import styles from './styles.module.scss';

const ScoringItem = () => (
  <li>
    <SectionDropdown isDefaultExpanded={true}>
      <span>Men’s Spring Thaw (Division: 2020, 2021)</span>
      <div>
        <ul className={styles.statisticList}>
          <li>
            <b>Games Complete:</b> {`1`}/{`72`}
          </li>
          <li>
            <b>Dates: </b>
            {`02/08/20`} - {`02/09/20`}
          </li>
          <li>
            <b>Scores Recorded:</b> {`1`}
          </li>
          <li>
            <b>Last Web Publishing:</b> {`01/22/20`}, {`12:30:07 PM`}
          </li>
        </ul>
        <ul className={styles.groupList}>
          <GroupItem />
        </ul>
      </div>
    </SectionDropdown>
  </li>
);

export default ScoringItem;
