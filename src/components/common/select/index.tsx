import React from 'react';
import { TextField as MuiTextField, MenuItem } from '@material-ui/core';
import styles from './style.module.scss';

interface ISelectProps {
  options: string[];
  label?: string;
  value: string;
  width?: string;
  onChange?: () => {};
}

const Select: React.FC<ISelectProps> = ({
  options,
  label,
  value,
  onChange,
  width,
}) => (
  <div className={styles.container}>
    <span className={styles.label}>{label}</span>
    <MuiTextField
      id="select"
      style={{ width: width || '100px' }}
      variant="outlined"
      size="small"
      select={true}
      value={value}
      onChange={onChange}
      fullWidth={true}
    >
      {options.map((option: string, index: number) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </MuiTextField>
  </div>
);

export default Select;
