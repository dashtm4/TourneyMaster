import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import styles from './style.module.scss';

interface ICheckboxProps {
  options: string[];
  formLabel: string;
  onChange: () => {};
}

const Checkbox: React.FC<ICheckboxProps> = ({
  options,
  formLabel,
  onChange,
}) => (
  <div className={styles.container}>
    <span className={styles.label}>{formLabel}</span>
    <FormGroup>
      {options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          control={<MuiCheckbox value={option} color="secondary" />}
          label={option}
          onChange={onChange}
        />
      ))}
    </FormGroup>
  </div>
);

export default Checkbox;
