import React from 'react';
import { TextField as MuiTextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from './style.module.scss';

// const defaultWidth = 100;

interface ITextFieldProps {
  endAdornment?: string;
  startAdornment?: string;
  label?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: string;
  value?: string | number;
  width?: string;
  placeholder?: string;
  onChange?: any;
  name?: string;
  disabled?: boolean;
  type?: 'text' | 'number';
  isRequired?: boolean;
}

const TextField: React.FC<ITextFieldProps> = ({
  endAdornment,
  startAdornment,
  label,
  fullWidth,
  multiline,
  rows,
  value,
  onChange,
  width,
  placeholder,
  name,
  disabled,
  type,
  isRequired,
}) => (
  <div className={styles.container}>
    <span className={styles.label}>{label}</span>
    <MuiTextField
      name={name}
      type={type || 'text'}
      style={{ width }}
      placeholder={placeholder}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
      multiline={multiline}
      disabled={disabled}
      rows={rows}
      value={value}
      onChange={onChange}
      required={isRequired}
      InputProps={{
        endAdornment: endAdornment && (
          <InputAdornment position="start">
            {endAdornment === 'search' ? <SearchIcon /> : endAdornment}
          </InputAdornment>
        ),
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
      }}
    />
  </div>
);

export default TextField;
