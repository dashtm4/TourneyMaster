import React from 'react';
import Button from 'components/common/buttons/button';
import { BindingAction } from 'common/models';
import FabButton from 'components/common/fab-button';
import styles from './styles.module.scss';
import { History } from 'history';
import { ButtonVariant, ButtonColors } from 'common/enums';

interface Props {
  onSaveClick: BindingAction;
  onCancelClick: BindingAction;
  eventId: string | undefined;
  history: History;
  onImportFromCsv: BindingAction;
}

const Navigation = ({
  onSaveClick,
  onCancelClick,
  eventId,
  history,
  onImportFromCsv,
}: Props) => {
  const onCreateTeam = () => {
    const path = eventId
      ? `/event/teams-create/${eventId}`
      : '/event/teams-create';

    history.push(path);
  };

  return (
    <div className={styles.navWrapper}>
      <Button
        onClick={onImportFromCsv}
        variant={ButtonVariant.TEXT}
        color={ButtonColors.SECONDARY}
        label="Import from CSV"
      />
      <span className={styles.btnsWrapper}>
        <Button
          onClick={onCancelClick}
          variant={ButtonVariant.TEXT}
          color={ButtonColors.SECONDARY}
          label="Cancel"
        />
        <Button
          onClick={onSaveClick}
          variant={ButtonVariant.CONTAINED}
          color={ButtonColors.PRIMARY}
          label="Save"
        />
        <Button
          onClick={onCreateTeam}
          variant={ButtonVariant.CONTAINED}
          color={ButtonColors.PRIMARY}
          label="Create Team"
        />
        <FabButton
          onClick={onCancelClick}
          sequence={1}
          label="Cancel"
          variant="outlined"
        />
        <FabButton
          onClick={onSaveClick}
          sequence={2}
          label="Save"
          variant="contained"
        />
      </span>
    </div>
  );
};

export default Navigation;
