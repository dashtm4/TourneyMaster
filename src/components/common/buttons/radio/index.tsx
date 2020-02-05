import React from 'react';
import {
  Radio as MuiRadio,
  FormControlLabel,
  RadioGroup,
} from '@material-ui/core';
import styles from './style.module.scss';

interface IRadioProps {
  options: string[];
  formLabel: string;
  onChange: () => {};
}

const Radio: React.FC<IRadioProps> = ({ options, formLabel, onChange }) => (
  <div className={styles.container}>
    <span className={styles.label}>{formLabel}</span>
    <RadioGroup aria-label="gender" name="gender1">
      {options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          value={option}
          control={<MuiRadio color="secondary" />}
          label={option}
          onChange={onChange}
        />
      ))}
    </RadioGroup>
  </div>
);

export default Radio;
