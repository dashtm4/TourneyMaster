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
    <TextField label={`Field ${fieldNumber}`} />
    <Checkbox options={['Illuminated', 'Premier Location']} />
  </fieldset>
);

export default Field;
