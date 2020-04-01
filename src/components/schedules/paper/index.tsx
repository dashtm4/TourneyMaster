import React from 'react';
import { Button, HeadingLevelThree, Paper } from 'components/common';
import styles from './styles.module.scss';

const publishBtnStyles = {
  width: 180,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

interface IProps {
  scheduleName: string;
  savingInProgress?: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onUnpublish: () => void;
  saveAndPublish: () => void;
}

export default (props: IProps) => {
  const {
    scheduleName,
    savingInProgress,
    onClose,
    onSaveDraft,
    onUnpublish,
    saveAndPublish,
  } = props;

  return (
    <div className={styles.paperWrapper}>
      <Paper>
        <div className={styles.paperContainer}>
          <div>
            <HeadingLevelThree>
              <span>{scheduleName}</span>
            </HeadingLevelThree>
          </div>
          <div className={styles.btnsGroup}>
            <Button
              label="Close"
              variant="text"
              color="secondary"
              onClick={onClose}
            />
            <Button
              label={savingInProgress ? 'Saving...' : 'Save'}
              variant="contained"
              color="primary"
              disabled={savingInProgress}
              onClick={onSaveDraft}
            />
            <Button
              label="Unpublish"
              variant="contained"
              color="primary"
              onClick={onUnpublish}
            />
            <Button
              btnStyles={publishBtnStyles}
              label={
                savingInProgress
                  ? 'Saving and publishing...'
                  : 'Save and Publish'
              }
              variant="contained"
              color="primary"
              disabled={savingInProgress}
              onClick={saveAndPublish}
            />
          </div>
        </div>
      </Paper>
    </div>
  );
};
