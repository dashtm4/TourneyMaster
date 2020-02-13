import React from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import TeamItem from '../team-item';
import styles from './styles.module.scss';

const GroupItem = () => (
  <li className={styles.groupItem}>
    <SectionDropdown isDefaultExpanded={true} headingColor={'#1C315F'}>
      <span>2020: East</span>
      <table className={styles.groupTable}>
        <thead>
          <tr>
            <td>Team</td>
            <td>W</td>
            <td>L</td>
            <td>GS</td>
            <td>GA</td>
          </tr>
        </thead>
        <tbody>
          <TeamItem />
        </tbody>
      </table>
    </SectionDropdown>
  </li>
);
export default GroupItem;
