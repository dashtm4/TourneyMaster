import React from 'react';
import { ProgressBar, Button, Tooltip } from 'components/common';
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
  percentOfCompleted,
  tournamentStatus,
  togglePublishPopup,
}: Props) => {
  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarStatusWrapper}>
        <p className={styles.progressBarStatus}>
          <span>Status:</span> {EventStatuses[tournamentStatus]}
        </p>
        {tournamentStatus === EventStatuses.Draft && (
          <p className={styles.progressBarComplete}>
            <output>{`${percentOfCompleted}% `}</output>
            Complete
          </p>
        )}
      </div>
      {tournamentStatus === EventStatuses.Draft ? (
        <>
          <ProgressBar completed={percentOfCompleted} />
          {percentOfCompleted === 100 && (
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
          )}
        </>
      ) : (
        <span className={styles.doneBtnWrapper}>
          <Button
            color={ButtonColors.INHERIT}
            variant={ButtonVarian.CONTAINED}
            disabled={true}
            label="Unpublish Event"
          />
        </span>
      )}
    </div>
  );
};

export default TournamentStatus;
