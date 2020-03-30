import React from 'react';
import Button from '../../../common/buttons/button';
import { getIcon } from '../../../../helpers/get-icon.helper';
import { Icons } from '../../../../common/enums/icons';
import { BindingAction } from '../../../../common/models';
import styles from './styles.module.scss';
import { History } from 'history';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  onSaveClick: BindingAction;
  onCancelClick: BindingAction;
  eventId: string | undefined;
  history: History;
}

const Navigation = ({
  onSaveClick,
  onCancelClick,
  eventId,
  history,
}: Props) => {
  const onCreateTeam = () => {
    const path = eventId
      ? `/event/teams-create/${eventId}`
      : '/event/teams-create';

    history.push(path);
  };

  return (
    <div className={styles.navWrapper}>
      <p>
        <Button
          icon={getIcon(Icons.GET_APP, ICON_STYLES)}
          label="Load From Library"
          variant="text"
          color="secondary"
        />
        <Button
          icon={getIcon(Icons.PUBLISH, ICON_STYLES)}
          label="Upload From File"
          variant="text"
          color="secondary"
        />
      </p>
      <p>
        <Button
          onClick={onCancelClick}
          label="Cancel"
          variant="text"
          color="secondary"
        />
        <span className={styles.btnWrapper}>
          <Button
            onClick={onSaveClick}
            label="Save"
            variant="contained"
            color="primary"
          />
        </span>
        <span className={styles.btnWrapper}>
          <Button
            label="Create Team"
            variant="contained"
            color="primary"
            onClick={onCreateTeam}
          />
        </span>
      </p>
    </div>
  );
};

export default Navigation;
