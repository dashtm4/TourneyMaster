import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import styles from './style.module.scss';

type Option = {
  label: string;
  checked: boolean;
};

interface ICheckboxProps {
  options: Option[];
  formLabel?: string;
  onChange?: any;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  options,
  formLabel,
  onChange,
}) => (
  <div className={styles.container}>
    <span className={styles.label}>{formLabel}</span>
    <FormGroup>
      {options.map((option: Option, index: number) => (
        <FormControlLabel
          key={index}
          control={
            <MuiCheckbox
              checked={option.checked}
              value={option.label}
              color="secondary"
            />
          }
          label={option.label}
          onChange={onChange}
        />
      ))}
    </FormGroup>
  </div>
);

export default Checkbox;
