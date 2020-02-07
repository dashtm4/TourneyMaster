import React from 'react';
import TextField from '../../../common/input';
import Checkbox from '../../../common/buttons/checkbox';
import styles from './styles.module.scss';

interface Props {
  fieldNumber: number;
  isEdit: boolean;
}

const Field = ({ fieldNumber, isEdit }: Props) => {
  const FIELD_OPTIONS = [
    {
      label: 'Illuminated',
      checked: false,
      disabled: !isEdit,
    },
    {
      label: 'Location',
      checked: false,
      disabled: !isEdit,
    },
  ];

  return (
    <fieldset className={styles.field}>
      <legend>Field {fieldNumber} Name</legend>
      <TextField
        placeholder={`Field ${fieldNumber}`}
        width="250px"
        disabled={!isEdit}
      />
      <Checkbox options={FIELD_OPTIONS} />
    </fieldset>
  );
};

export default Field;
