import React from 'react';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';
import WarningIcon from '@material-ui/icons/Warning';

const DeleteDivision = ({ onClose }: any) => {
  const onDelete = () => {
    //TODO Delete
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionItemWarning}>
        <div className={styles.iconContainer}>
          <WarningIcon style={{ fill: '#FF0F19' }} />
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
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteDivision;
