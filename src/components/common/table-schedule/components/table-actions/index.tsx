import React from 'react';
import { Button, CardMessage } from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, Icons } from 'common/enums';
import { OptimizeTypes } from '../../types';
import styles from './styles.module.scss';
import { BindingAction } from 'common/models';

const CARD_MESSAGE_FOR_UNDO = 'Press multiple times to go back more than once.';

interface IProps {
  zoomingDisabled: boolean;
  optimizeBy: OptimizeTypes;
  onUndoClick: BindingAction;
  onLockAllClick: BindingAction;
  onUnlockAllClick: BindingAction;
  toggleZooming: () => void;
  onOptimizeClick: (optimizeBy: OptimizeTypes) => void;
}

const TableActions = (props: IProps) => {
  const {
    zoomingDisabled,
    onUndoClick,
    onLockAllClick,
    onUnlockAllClick,
    toggleZooming,
  } = props;

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
            label={zoomingDisabled ? 'Drag-n-Drop mode' : 'Zoom-n-Nav mode'}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            icon={getIcon(zoomingDisabled ? Icons.FLIP : Icons.ZOOM)}
            onClick={toggleZooming}
          />
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
      </form>
    </section>
  );
};

export default TableActions;
