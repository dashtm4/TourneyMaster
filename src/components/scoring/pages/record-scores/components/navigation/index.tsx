import React from 'react';
import { Button } from 'components/common';
import history from 'browserhistory';
import { Routes } from 'common/constants';
import { ViewTypes } from '../../index';
import styles from './styles.module.scss';

enum ButtonTypes {
  SQUARED = 'squared',
  SQUARED_OUTLINED = 'squaredOutlined',
}

interface Props {
  view: ViewTypes;
  eventId?: string;
  onChangeView: (type: ViewTypes) => void;
}

const Navigation = ({ view, eventId, onChangeView }: Props) => (
  <div className={styles.navWrapper}>
    <p className={styles.btnsViewWrapper}>
      <span className={styles.btnWrapper}>
        <Button
          onClick={() => onChangeView(ViewTypes.VIEW_ONLY)}
          type={
            view === ViewTypes.VIEW_ONLY
              ? ButtonTypes.SQUARED
              : ButtonTypes.SQUARED_OUTLINED
          }
          label="View Only"
          variant="contained"
          color="primary"
        />
      </span>
      <Button
        onClick={() => onChangeView(ViewTypes.ENTER_SCORES)}
        type={
          view === ViewTypes.VIEW_ONLY
            ? ButtonTypes.SQUARED_OUTLINED
            : ButtonTypes.SQUARED
        }
        label="Enter Scores"
        variant="contained"
        color="primary"
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
