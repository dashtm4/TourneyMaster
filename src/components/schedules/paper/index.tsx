import React from 'react';
import { Button, HeadingLevelThree, Paper, Tooltip } from 'components/common';
import styles from './styles.module.scss';
import { TooltipMessageTypes } from 'components/common/tooltip-message/types';

const publishBtnStyles = {
  width: 180,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

interface IProps {
  scheduleName: string;
  savingInProgress?: boolean;
  anotherSchedulePublished?: boolean;
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
    anotherSchedulePublished,
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
              label={'Save'}
              variant="contained"
              color="primary"
              disabled={savingInProgress}
              onClick={onSaveDraft}
            />
            <Button
              label="Unpublish"
              variant="contained"
              color="primary"
              disabled={savingInProgress || !anotherSchedulePublished}
              onClick={onUnpublish}
            />
            <Tooltip
              disabled={!anotherSchedulePublished}
              title="asdasd"
              type={TooltipMessageTypes.INFO}
            >
              <>
                <Button
                  btnStyles={publishBtnStyles}
                  label={'Save and Publish'}
                  variant="contained"
                  color="primary"
                  disabled={anotherSchedulePublished || savingInProgress}
                  onClick={saveAndPublish}
                />
              </>
            </Tooltip>
          </div>
        </div>
      </Paper>
    </div>
  );
};
