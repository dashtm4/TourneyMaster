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
  name?: string;
  value?: any;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  options,
  formLabel,
  onChange,
  checked,
  name,
  value,
}) => (
  <div className={styles.container}>
    <span className={styles.label}>{formLabel}</span>
    <FormGroup>
      {options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          control={<MuiCheckbox value={value} color="secondary" />}
          label={option}
          onChange={onChange}
          name={name}
          checked={checked}
        />
      ))}
    </FormGroup>
  </div>
);

export default Checkbox;
