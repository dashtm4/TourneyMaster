import React from 'react';
import { Button } from 'components/common';
import history from 'browserhistory';
import { Routes } from 'common/constants';
import styles from './styles.module.scss';

interface Props {
  eventId?: string;
}

const Navigation = ({ eventId }: Props) => (
  <div className={styles.navWrapper}>
    <p className={styles.btnsViewWrapper}>
      <span className={styles.btnWrapper}>
        <Button
          label="View Only"
          variant="contained"
          type="squared"
          color="primary"
        />
      </span>
      <Button
        label="Enter Scores"
        variant="contained"
        color="primary"
        type="squaredOutlined"
      />
    </p>
    <p className={styles.btnsSaveWrapper}>
      <span className={styles.btnWrapper}>
        <Button
          onClick={() => history.push(`${Routes.SCORING}${eventId || ''}`)}
          label="Close"
          variant="text"
          color="secondary"
        />
      </span>
      <span className={styles.btnWrapper}>
        <Button label="Save Draft" variant="contained" color="primary" />
      </span>
      <Button label="Save & Publish" variant="contained" color="primary" />
    </p>
  </div>
);

export default Navigation;
