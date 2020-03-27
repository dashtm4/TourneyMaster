import React from 'react';
import Button from 'components/common/buttons/button';
import { BindingAction, ITeam } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  team: ITeam | null;
  onCloseModal: BindingAction;
  onDeleteClick: (team: ITeam) => void;
}

const PopupDeleteTeam = ({ team, onCloseModal, onDeleteClick }: Props) => {
  if (!team) {
    return null;
  }

  return (
    <section className={styles.popupWrapper}>
      <h2 className="visually-hidden">Delete team popup</h2>
      <p className={styles.textWrapper}>Delete “{team.long_name}” ?</p>
      <p className={styles.btnsWrapper}>
        <span className={styles.cancelBtnWrapper}>
          <Button
            onClick={onCloseModal}
            label="Cancel"
            variant="text"
            color="secondary"
          />
        </span>
        <Button
          onClick={() => onDeleteClick(team)}
          label="Delete"
          variant="contained"
          type="danger"
          color="primary"
        />
      </p>
    </section>
  );
};

export default PopupDeleteTeam;
