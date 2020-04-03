import React from 'react';
import { ProgressBar, Button } from 'components/common';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, EventStatuses, Icons } from 'common/enums';
import styles from './styles.module.scss';

interface Props {
  tournamentStatus: EventStatuses;
  percentOfCompleted: number;
  changeTournamentStatus?: (status: EventStatuses) => void;
}

const TournamentStatus = ({
  percentOfCompleted,
  tournamentStatus,
  changeTournamentStatus,
}: Props) => {
  if (!changeTournamentStatus) {
    return null;
  }

  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarStatusWrapper}>
        <p className={styles.progressBarStatus}>
          <span>Status:</span> {tournamentStatus}
        </p>
        {tournamentStatus === EventStatuses.DRAFT && (
          <p className={styles.progressBarComplete}>
            <output>{`${percentOfCompleted}% `}</output>
            Complete
          </p>
        )}
      </div>
      {tournamentStatus === EventStatuses.DRAFT ? (
        <>
          <ProgressBar completed={percentOfCompleted} />
          {percentOfCompleted === 100 && (
            <span className={styles.doneBtnWrapper}>
              <Button
                onClick={() => changeTournamentStatus(EventStatuses.PUBLIHSED)}
                icon={getIcon(Icons.DONE)}
                label="Publish Tournament"
                color={ButtonColors.INHERIT}
                variant={ButtonVarian.CONTAINED}
              />
            </span>
          )}
        </>
      ) : (
        <span className={styles.doneBtnWrapper}>
          <Button
            onClick={() => changeTournamentStatus(EventStatuses.DRAFT)}
            label="Unpublish Tournament"
            color={ButtonColors.INHERIT}
            variant={ButtonVarian.CONTAINED}
          />
        </span>
      )}
    </div>
  );
};

export default TournamentStatus;
