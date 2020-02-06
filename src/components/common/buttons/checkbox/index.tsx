import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import styles from './style.module.scss';

interface ICheckboxProps {
  options: string[];
  checked?: boolean;
  formLabel?: string;
  onChange?: any;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  options,
  formLabel,
  onChange,
  checked,
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
          checked={checked}
        />
      ))}
    </FormGroup>
  </div>
);

export default Checkbox;
