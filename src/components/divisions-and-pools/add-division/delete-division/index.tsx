import React from 'react';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import WarningIcon from '@material-ui/icons/Warning';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { IDivision } from 'common/models/divisions';

interface IDeleteDivisionProps {
  onClose: BindingAction;
  deleteDivision: BindingCbWithOne<string>;
  divisionId: string;
  division: Partial<IDivision>;
}

const DeleteDivision = ({
  onClose,
  deleteDivision,
  divisionId,
  division,
}: IDeleteDivisionProps) => {
  const onDeleteDivision = () => {
    deleteDivision(divisionId);
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionItemWarning}>
        <div className={styles.iconContainer}>
          <WarningIcon style={{ fill: '#FFCB00' }} />
        </div>
        <div className={styles.title}>
          Deleting a division will also delete all pools inside the division.
          Teams inside the division will be moved to unassigned.
        </div>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.title}>Pools:</span> {division.num_pools || '—'}
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.title}>Teams:</span>{' '}
        {division.teams_registered || '—'}
      </div>
      <div className={styles.buttonsGroup}>
        <div>
          <Button
            label="Cancel"
            variant="text"
            color="secondary"
            onClick={onClose}
          />
          <Button
            label="Delete"
            variant="contained"
            color="primary"
            type="danger"
            onClick={onDeleteDivision}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteDivision;
