import React from 'react';
import { Button, CardMessage, Select } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, Icons } from 'common/enums';
import { OptimizeTypes } from '../../types';
import styles from './styles.module.scss';
import { BindingAction } from 'common/models';

const CARD_MESSAGE_FOR_UNDO = 'Press multiple times to go back more than once.';

interface Props {
  optimizeBy: OptimizeTypes;
  onUndoClick: BindingAction;
  onLockAllClick: BindingAction;
  onUnlockAllClick: BindingAction;
  onOptimizeClick: (optimizeBy: OptimizeTypes) => void;
}

const TableActions = ({
  optimizeBy,
  onUndoClick,
  onLockAllClick,
  onUnlockAllClick,
  onOptimizeClick,
}: Props) => {
  const [optimizeByValue, onOptimizeByChange] = React.useState<OptimizeTypes>(
    optimizeBy
  );

  return (
    <section>
      <h3 className="visually-hidden">More functions</h3>
      <form className={styles.form}>
        <div className={styles.undoBtnWrapper}>
          <Button
            onClick={onUndoClick}
            icon={getIcon(Icons.SETTINGS_BACKUP_RESTORE)}
            label="Undo"
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
          />
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            {CARD_MESSAGE_FOR_UNDO}
          </CardMessage>
        </div>
        <p className={styles.lockBtnsWrapper}>
          <Button
            onClick={onLockAllClick}
            icon={getIcon(Icons.LOCK)}
            label="Lock All"
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
          />
          <Button
            onClick={onUnlockAllClick}
            icon={getIcon(Icons.LOCK_OPEN)}
            label="Unlock All"
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
          />
        </p>
        <Select
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
            onOptimizeByChange(evt.target.value as OptimizeTypes)
          }
          value={optimizeByValue}
          label="Rebalance and Optimize By"
          options={Object.keys(OptimizeTypes).map(it => ({
            label: OptimizeTypes[it],
            value: OptimizeTypes[it],
          }))}
        />
        <Button
          onClick={() => onOptimizeClick(optimizeByValue)}
          label="Optimize"
          variant={ButtonVarian.CONTAINED}
          color={ButtonColors.PRIMATY}
        />
      </form>
    </section>
  );
};

export default TableActions;
