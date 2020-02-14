import React from 'react';
import styles from './styles.module.scss';
import Button from '../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';

const PoolsDetails = ({ onAddPool }: any) => (
  <div>
    <div className={styles.headingContainer}>
      <span className={styles.title}>Pools</span>
      <div>
        <Button
          label="+ Add Pool"
          variant="text"
          color="secondary"
          onClick={onAddPool}
        />
        <Button
          label="Edit Pool Details"
          variant="text"
          color="secondary"
          icon={<CreateIcon />}
        />
      </div>
    </div>
    <div className={styles.poolsContainer}>
      <div className={styles.pool}>
        <p className={styles.poolTitle}>East</p>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
        </ul>
      </div>
      <div className={styles.pool}>
        <p className={styles.poolTitle}>West</p>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
      </div>
      <div className={styles.pool}>
        <p className={styles.poolTitle}>Unassigned</p>
        <ul>
          <li>None</li>
        </ul>
      </div>
    </div>
  </div>
);

export default PoolsDetails;
