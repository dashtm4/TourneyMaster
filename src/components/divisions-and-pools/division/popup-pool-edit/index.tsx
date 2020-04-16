import React from 'react';
import {
  Modal,
  HeadingLevelTwo,
  Select,
  Input,
  Button,
} from 'components/common';
import { BindingAction, IPool, BindingCbWithOne } from 'common/models';
import { ButtonVarian, ButtonColors, IPoolFields } from 'common/enums';
import { IInputEvent } from 'common/types';
import { getPoolOptions } from './helpers';
import styles from './styles.module.scss';

interface Props {
  pools: IPool[];
  isOpen: boolean;
  onClose: BindingAction;
  onEdit: BindingCbWithOne<IPool>;
}

const PopupEditPool = ({ pools, isOpen, onClose, onEdit }: Props) => {
  const [activePool, changeActivePool] = React.useState<IPool | null>(null);

  React.useEffect(() => {
    return () => {
      changeActivePool(null);
    };
  }, [isOpen]);

  const onChangeActivePool = ({ target: { value } }: IInputEvent) => {
    const poolById = pools.find(it => it.pool_id === value) as IPool;

    changeActivePool(poolById);
  };

  const onChangePool = ({ target: { value, name } }: IInputEvent) => {
    changeActivePool({ ...activePool, [name]: value } as IPool);
  };

  const onSave = () => {
    if (activePool) {
      onEdit(activePool);

      onClose();
    }
  };

  const options = getPoolOptions(pools);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Edit Pool</HeadingLevelTwo>
        </div>
        <div className={styles.selectWrapper}>
          <Select
            onChange={onChangeActivePool}
            value={activePool?.pool_id || ''}
            options={options}
            label="Select pool"
          />
        </div>
        <fieldset className={styles.inputsWrapper}>
          <legend className="visually-hidden">Pool information</legend>
          <ul className={styles.inputsList}>
            <li>
              <Input
                onChange={onChangePool}
                value={activePool?.pool_name || ''}
                name={IPoolFields.POOL_NAME}
                disabled={!activePool}
                label="Name"
              />
            </li>
            <li>
              <Input
                onChange={onChangePool}
                value={activePool?.pool_tag || ''}
                name={IPoolFields.POOL_TAG}
                disabled={!activePool}
                startAdornment="@"
                label="Tag"
              />
            </li>
          </ul>
        </fieldset>
        <p className={styles.btnsWrapper}>
          <Button
            onClick={onClose}
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Cancel"
          />
          <span className={styles.btnWrapper}>
            <Button
              onClick={onSave}
              disabled={!activePool}
              variant={ButtonVarian.CONTAINED}
              color={ButtonColors.PRIMARY}
              label="Save"
            />
          </span>
        </p>
      </section>
    </Modal>
  );
};

export default PopupEditPool;
