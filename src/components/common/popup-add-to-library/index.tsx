import React from 'react';
import { Modal, HeadingLevelTwo, Select, Button } from 'components/common';
import { BindingAction } from 'common/models';
import { ButtonVarian, ButtonColors, EntryPoints } from 'common/enums';
import { IEntity, IInputEvent } from 'common/types';
import { getSelectOptions } from './helpers';
import styles from './styles.module.scss';

interface Props {
  entities: IEntity[];
  entryPoint: EntryPoints;
  isOpen: boolean;
  onClose: BindingAction;
  onSave: BindingAction;
}

const PopupAddToLibrary = ({
  entities,
  entryPoint,
  isOpen,
  onClose,
  onSave,
}: Props) => {
  const [activeOption, changeOption] = React.useState<string | null>(null);
  const selectOptions = getSelectOptions(entities, entryPoint);

  const onChangeOption = (evt: IInputEvent) => {
    changeOption(evt.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Save to Library:</HeadingLevelTwo>
        </div>
        <div className={styles.SelectWrapper}>
          {selectOptions?.length !== 0 ? (
            <Select
              onChange={onChangeOption}
              value={activeOption || ''}
              options={selectOptions!}
              label="Select event"
              width="100%"
            />
          ) : (
            <p>You don’t have items to share</p>
          )}
        </div>
        <p className={styles.btnsWrapper}>
          <span className={styles.btnWrapper}>
            <Button
              onClick={onClose}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              label="Cancel"
            />
          </span>
          <span className={styles.btnWrapper}>
            <Button
              onClick={onSave}
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

export default PopupAddToLibrary;
