import React from 'react';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import WarningIcon from '@material-ui/icons/Warning';

const DeleteDivision = ({
  onClose,
  deleteDivision,
  divisionId,
  history,
}: any) => {
  const onDeleteDivision = () => {
    deleteDivision(divisionId);
    onClose();
    history.goBack();
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
        <span className={styles.title}>Pools:</span> {'—'}
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.title}>Teams:</span> {'—'}
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
