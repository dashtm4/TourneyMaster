import React from 'react';
import styles from './styles.module.scss';

const FieldItem = () => (
  <li className={styles.fieldItem}>
    <p className={styles.fieldDates}>
      <span>Field 1</span>
      <time>02/08/20</time>
      <time>08:00 AM</time>
    </p>
    <table className={styles.fieldTable}>
      <tbody>
        <tr>
          <td className={styles.fieldTeamTitle}>Big 4 HHH</td>
          <td>
            <i>0</i>
          </td>
        </tr>
        <tr>
          <td className={styles.fieldTeamTitle}>LaxWorld Club </td>
          <td>
            <i>0</i>
          </td>
        </tr>
      </tbody>
    </table>
  </li>
);

export default FieldItem;
