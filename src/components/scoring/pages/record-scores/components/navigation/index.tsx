import React from 'react';
import { Button } from 'components/common';
import { ButtonTypes } from 'common/enums';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  isEnterScores: boolean;
  onChangeView: (flag: boolean) => void;
  onLeavePage: BindingAction;
}

const Navigation = ({ isEnterScores, onChangeView, onLeavePage }: Props) => (
  <div className={styles.navWrapper}>
    <p className={styles.btnsViewWrapper}>
      <span className={styles.btnWrapper}>
        <Button
          onClick={() => onChangeView(false)}
          type={
            isEnterScores
              ? ButtonTypes.SQUARED
              : ButtonTypes.SQUARED_OUTLINED
          }
          label="View Only"
          variant="contained"
          color="primary"
        />
      </span>
      <Button
        onClick={() => onChangeView(true)}
        type={
          isEnterScores
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
          onClick={onLeavePage}
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
