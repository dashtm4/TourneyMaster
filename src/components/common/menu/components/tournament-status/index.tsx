import React from 'react';
import { Button, Tooltip } from 'components/common';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, EventStatuses, Icons } from 'common/enums';
import styles from './styles.module.scss';
import { BindingAction } from 'common/models';

interface Props {
  tournamentStatus: EventStatuses;
  percentOfCompleted: number;
  togglePublishPopup: BindingAction;
}

const TournamentStatus = ({
  // percentOfCompleted,
  tournamentStatus,
  togglePublishPopup,
}: Props) => {
  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarStatusWrapper}>
        <p className={styles.progressBarStatus}>
          <span>Status:</span> {EventStatuses[tournamentStatus]}
        </p>
      </div>
      {tournamentStatus === EventStatuses.Draft ? (
        <>
          {/* {percentOfCompleted === 100 && ( */}
          <Tooltip
            title="Only click publish when this checklist is 100% complete"
            type="info"
          >
            <span className={styles.doneBtnWrapper}>
              <Button
                onClick={togglePublishPopup}
                icon={getIcon(Icons.DONE)}
                label="Publish Event"
                color={ButtonColors.INHERIT}
                variant={ButtonVarian.CONTAINED}
              />
            </span>
          </Tooltip>
          {/* )} */}
        </>
      ) : (
        <span className={styles.doneBtnWrapper}>
          <Button
            onClick={togglePublishPopup}
            color={ButtonColors.INHERIT}
            variant={ButtonVarian.CONTAINED}
            label="Unpublish Event"
          />
        </span>
      )}
    </div>
  );
};

export default TournamentStatus;
