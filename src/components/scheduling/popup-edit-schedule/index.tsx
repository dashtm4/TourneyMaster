import React from 'react';
import { Modal, HeadingLevelTwo, Input, Button } from 'components/common';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { getIcon } from 'helpers';
import {
  Icons,
  ButtonColors,
  ButtonVarian,
  ButtonFormTypes,
} from 'common/enums';
import { ISchedulingSchedule, ArchitectFormFields } from '../types';
import styles from './styles.module.scss';

const DELETE_ICON_STYLES = {
  marginRight: '5px',
  fill: '#FF0F19',
};

interface Props {
  schedule: ISchedulingSchedule | null;
  onClose: BindingAction;
  onSubmit: BindingCbWithOne<ISchedulingSchedule>;
}

const PopupEditSchedule = ({ schedule, onClose, onSubmit }: Props) => {
  const [editedSchedule, onChange] = React.useState<ISchedulingSchedule>(
    schedule!
  );

  const localChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...editedSchedule, [name]: value });

  const localSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    onSubmit(editedSchedule);

    if (editedSchedule.schedule_name) {
      onClose();
    }
  };

  return (
    <Modal isOpen={Boolean(schedule)} onClose={onClose}>
      <section className={styles.popupWrapper}>
        <div className={styles.titleWrapper}>
          <HeadingLevelTwo>Edit Schedule</HeadingLevelTwo>
        </div>
        <form onSubmit={localSubmit}>
          <div className={styles.inputWrapper}>
            <Input
              onChange={localChange}
              value={editedSchedule.schedule_name || ''}
              name={ArchitectFormFields.SCHEDULE_NAME}
              label="Name"
              width="220px"
            />
            <Input
              onChange={localChange}
              value={editedSchedule.schedule_tag || ''}
              name={ArchitectFormFields.SCHEDULT_TAG}
              label="Tag"
              width="220px"
              startAdornment="@"
            />
          </div>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>
                  <b>Divisions: </b>
                  {editedSchedule.num_divisions}
                </td>
                <td>
                  <b>Teams: </b>
                  {editedSchedule.num_teams}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Playoffs: </b>
                  Yes
                </td>
                <td>
                  <b>Bracket Type: </b>
                  Single Elimination
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.btnsWrapper}>
            <p className={styles.dellBtnWrapper}>
              <Button
                icon={getIcon(Icons.DELETE, DELETE_ICON_STYLES)}
                variant={ButtonVarian.TEXT}
                color={ButtonColors.INHERIT}
                btnType={ButtonFormTypes.BUTTON}
                label="Delete Schedule &amp; Bracket"
              />
            </p>
            <div className={styles.navBtnWrapper}>
              <p className={styles.cancelBtnWrapper}>
                <Button
                  onClick={onClose}
                  variant={ButtonVarian.TEXT}
                  color={ButtonColors.SECONDARY}
                  btnType={ButtonFormTypes.BUTTON}
                  label="Cancel"
                />
              </p>
              <Button
                variant={ButtonVarian.CONTAINED}
                color={ButtonColors.PRIMATY}
                btnType={ButtonFormTypes.SUBMIT}
                label="Save"
              />
            </div>
          </div>
        </form>
      </section>
    </Modal>
  );
};

export default PopupEditSchedule;
