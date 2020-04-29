import React from 'react';
import { Button } from 'components/common';
import ListPublised from '../list-publised';
import { getIcon, CheckEventDrafts } from 'helpers';
import { ButtonColors, ButtonVarian, EventStatuses, Icons } from 'common/enums';
import {
  BindingAction,
  IEventDetails,
  ISchedule,
  IFetchedBracket,
} from 'common/models';
import styles from './styles.module.scss';

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  brackets: IFetchedBracket[];
  togglePublishPopup: BindingAction;
  toggleUnpublishPopup: BindingAction;
}

const TournamentStatus = ({
  event,
  schedules,
  brackets,
  togglePublishPopup,
  toggleUnpublishPopup,
}: Props) => {
  const hasAllDruft = CheckEventDrafts.checkAllDraft(
    event,
    schedules,
    brackets
  );

  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarStatusWrapper}>
        <p className={styles.progressBarStatus}>
          <span>Status:</span> {EventStatuses[event.is_published_YN]}
        </p>
        <ListPublised event={event} schedules={schedules} brackets={brackets} />
      </div>
      {hasAllDruft ? (
        <span className={styles.doneBtnWrapper}>
          <Button
            onClick={togglePublishPopup}
            icon={getIcon(Icons.DONE)}
            label="Publish Event"
            color={ButtonColors.INHERIT}
            variant={ButtonVarian.CONTAINED}
          />
        </span>
      ) : (
        <span className={styles.doneBtnWrapper}>
          <Button
            onClick={toggleUnpublishPopup}
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
