/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Modal, HeadingLevelTwo, Button, Select } from 'components/common';
import SectionConfirm from '../section-confirm';
import SectionModify from '../section-modify';
import {
  BindingAction,
  IEventDetails,
  ISchedule,
  IFetchedBracket,
  IPublishSettings,
  BindingCbWithThree,
} from 'common/models';
import {
  ButtonVarian,
  ButtonColors,
  EventPublishTypes,
  EventModifyTypes,
} from 'common/enums';
import { IInputEvent } from 'common/types';
import { getModifyStatuOptions } from '../../helpers';
import styles from './styles.module.scss';

const modifyStatuOptions = getModifyStatuOptions();

const BUTTON_STYLES = {
  width: '115px',
};

interface Props {
  event: IEventDetails;
  schedules: ISchedule[];
  brackets: IFetchedBracket[];
  isOpen: boolean;
  onClose: BindingAction;
  publishEventData: BindingCbWithThree<
    EventPublishTypes,
    EventModifyTypes,
    IPublishSettings
  >;
}

const PopupPublishEvent = ({
  event,
  schedules,
  brackets,
  isOpen,
  onClose,
  publishEventData,
}: Props) => {
  const [isConfrimOpen, toggleConfrim] = React.useState<boolean>(false);
  const [
    publishType,
    changePublishValue,
  ] = React.useState<EventPublishTypes | null>(null);

  const [modifyModValue, changeModifyModeValue] = React.useState<
    EventModifyTypes
  >(EventModifyTypes.PUBLISH);

  const onChangeModifyModeValue = ({ target }: IInputEvent) => {
    changePublishValue(null);

    changeModifyModeValue(target.value as EventModifyTypes);
  };

  React.useEffect(() => {
    changeModifyModeValue(EventModifyTypes.PUBLISH);
    toggleConfrim(false);
    changePublishValue(null);
  }, [isOpen]);

  const onToggleConfrim = () => {
    toggleConfrim(!isConfrimOpen);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={styles.section}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Modify Published Status</HeadingLevelTwo>
        </div>
        {isConfrimOpen && publishType ? (
          <SectionConfirm
            event={event}
            schedules={schedules}
            brackets={brackets}
            publishType={publishType}
            modifyModValue={modifyModValue}
            onClose={onClose}
            publishEventData={publishEventData}
          />
        ) : (
          <>
            <div className={styles.modifyWrapper}>
              <div className={styles.selectWrapper}>
                <Select
                  value={modifyModValue}
                  options={modifyStatuOptions}
                  onChange={onChangeModifyModeValue}
                  label="Modify mode"
                />
              </div>
              <SectionModify
                event={event}
                schedules={schedules}
                brackets={brackets}
                modifyModValue={modifyModValue}
                publishType={publishType}
                changePublishValue={changePublishValue}
              />
            </div>
            <p className={styles.btnsWrapper}>
              <Button
                onClick={onClose}
                variant={ButtonVarian.TEXT}
                color={ButtonColors.SECONDARY}
                btnStyles={BUTTON_STYLES}
                label="Cancel"
              />
              <span className={styles.btnWrapper}>
                <Button
                  onClick={onToggleConfrim}
                  variant={ButtonVarian.CONTAINED}
                  color={ButtonColors.PRIMARY}
                  btnStyles={BUTTON_STYLES}
                  disabled={!Boolean(publishType)}
                  label="Save"
                />
              </span>
            </p>
          </>
        )}
      </section>
    </Modal>
  );
};

export default PopupPublishEvent;
