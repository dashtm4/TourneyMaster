import React from 'react';
import { Button } from 'components/common';
import { BindingAction, IDivision } from 'common/models';
import styles from './styles.module.scss';
import { getIcon } from 'helpers';
import { Icons, ButtonVarian, ButtonColors } from 'common/enums';
import { ButtonCopy } from 'components/common';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  isArrange: boolean;
  onAdd: BindingAction;
  onArrange: BindingAction;
  onCancel: BindingAction;
  onSave: BindingAction;
  onEdit: BindingAction;
  division: IDivision;
}

const PoolsDetailsNav = ({
  isArrange,
  onAdd,
  onArrange,
  onCancel,
  onSave,
  onEdit,
  division,
}: Props) => {
  const inviteLink = `${window.location.origin.toString()}/register/event/${
    division.event_id
  }?division=${encodeURIComponent(division.short_name)}&division_id=${
    division.division_id
  }`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.poolsBtns}>
        <ButtonCopy
          copyString={inviteLink}
          label={'Invite Teams'}
          color={ButtonColors.SECONDARY}
          variant={ButtonVarian.TEXT}
          successMessage="Team invitation link copied to clipboard"
        />
        <Button
          onClick={onAdd}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label="+ Add Pool"
        />
        <Button
          onClick={onEdit}
          icon={getIcon(Icons.EDIT)}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label="Edit Pool Details"
        />
      </div>
      <div className={styles.teamBtns}>
        {isArrange ? (
          <p>
            <Button
              onClick={onCancel}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              label="Cancel"
            />
            <span className={styles.btnWrapper}>
              <Button
                onClick={onSave}
                variant={ButtonVarian.CONTAINED}
                color={ButtonColors.PRIMARY}
                label="Save"
              />
            </span>
          </p>
        ) : (
          <Button
            onClick={onArrange}
            icon={getIcon(Icons.EDIT, ICON_STYLES)}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Arrange Teams"
          />
        )}
      </div>
    </div>
  );
};

export default PoolsDetailsNav;
