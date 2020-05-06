import React from 'react';
import { Modal, HeadingLevelFour, Radio, Button } from 'components/common';
import styles from '../styles.module.scss';
import { BindingAction, BindingCbWithOne, IEventDetails } from 'common/models';
import { IInputEvent } from 'common/types';
import { TypeOptions } from '../index';
import { eventTypeOptions } from 'components/event-details/event-structure';
interface Props {
  event: IEventDetails;
  isOpenModalOpen: boolean;
  onTypeSelect: BindingAction;
  type: number;
  onTypeChange: BindingCbWithOne<IInputEvent>;
}

const PopupRegistrationType = ({
  event,
  type,
  onTypeChange,
  isOpenModalOpen,
  onTypeSelect,
}: Props) => {
  const showcaseTypeOptions = [TypeOptions[1], TypeOptions[2]];
  const tournamentTypeOptions = [TypeOptions[3], TypeOptions[4]];

  const options =
    event && eventTypeOptions[event.event_type] === eventTypeOptions.Showcase
      ? showcaseTypeOptions
      : tournamentTypeOptions;

  return (
    <Modal isOpen={isOpenModalOpen} onClose={() => {}}>
      <div className={styles.modalContainer}>
        <div style={{ height: '190px' }}>
          <HeadingLevelFour>
            <span>Event Registration</span>
          </HeadingLevelFour>
          <p className={styles.message}>
            Do you want to register as an individual or as a team?
          </p>
          <div className={styles.radioBtnsWrapper}>
            <Radio
              options={options}
              formLabel=""
              onChange={onTypeChange}
              checked={TypeOptions[type] || ''}
            />
          </div>
          <div className={styles.btnWrapper}>
            <Button
              label="Next"
              color="primary"
              variant="contained"
              onClick={onTypeSelect}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PopupRegistrationType;
