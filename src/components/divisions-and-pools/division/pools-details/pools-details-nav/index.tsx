import React from 'react';
import { Button } from 'components/common';
import CreateIcon from '@material-ui/icons/Create';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { getIcon } from 'helpers';
import { Icons, ButtonVarian, ButtonColors } from 'common/enums';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  isArrange: boolean;
  onAdd: BindingAction;
  onArrangeClick: BindingAction;
}

const PoolsDetailsNav = ({ isArrange, onAdd, onArrangeClick }: Props) => (
  <div className={styles.wrapper}>
    <div className={styles.poolsBtns}>
      <Button
        onClick={onAdd}
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        label="+ Add Pool"
      />
      <Button
        variant={ButtonVarian.TEXT}
        color={ButtonColors.SECONDARY}
        icon={<CreateIcon />}
        disabled={true}
        label="Edit Pool Details"
      />
    </div>
    <div className={styles.teamBtns}>
      {isArrange ? (
        <p>
          <Button
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Cancel"
          />
          <span className={styles.btnWrapper}>
            <Button
              variant={ButtonVarian.CONTAINED}
              color={ButtonColors.PRIMARY}
              label="Save"
            />
          </span>
        </p>
      ) : (
        <Button
          onClick={onArrangeClick}
          icon={getIcon(Icons.EDIT, ICON_STYLES)}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label="Arrange Teams"
        />
      )}
    </div>
  </div>
);

export default PoolsDetailsNav;
