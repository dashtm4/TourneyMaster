import React from 'react';
import SectionDropdown from '../../../common/section-dropdown';
import styles from './styles.module.scss';

const GroupItem = () => (
  <li className={styles.groupItem}>
    <SectionDropdown>
      <span>2020: East</span>
      <table>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </SectionDropdown>
  </li>
);
export default GroupItem;
