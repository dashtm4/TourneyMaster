import React from 'react';
import { Modal, HeadingLevelTwo, Select, Button } from 'components/common';
import { IEventDetails, BindingAction } from 'common/models';
import styles from './styles.module.scss';
import { ButtonVarian, ButtonColors } from 'common/enums';

interface Props {
  activeEvent: IEventDetails | null;
  events: IEventDetails[];
  isOpen: boolean;
  onClose: BindingAction;
  onChangeActiveEvent: (event: IEventDetails) => void;
}

const PopupShare = ({
  activeEvent,
  events,
  isOpen,
  onClose,
  onChangeActiveEvent,
}: Props) => {
  const seletOptions = events.map(it => ({
    label: it.event_name,
    value: it.event_id,
  }));

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const currentEvent = events.find(it => it.event_id === value);

    onChangeActiveEvent(currentEvent!);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Share with event</HeadingLevelTwo>
        </div>
        <div className={styles.SelectWrapper}>
          <Select
            onChange={onChange}
            value={activeEvent?.event_id || ''}
            options={seletOptions}
            label="Select event"
            width="100%"
          />
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

export default PopupShare;
