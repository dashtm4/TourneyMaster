import React from 'react';
import TextField from '../../../common/input';
import Checkbox from '../../../common/buttons/checkbox';
import styles from './styles.module.scss';

interface Props {
  fieldNumber: number;
}

const Field = ({ fieldNumber }: Props) => (
  <fieldset className={styles.field}>
    <legend>Field {fieldNumber} Name</legend>
    <TextField placeholder={`Field ${fieldNumber}`} width="250px" />
    <Checkbox
      options={[
        { label: 'Illuminated', checked: false },
        { label: 'Premier Location', checked: false },
      ]}
    />
  </fieldset>
);

export default Field;
