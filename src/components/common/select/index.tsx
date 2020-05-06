import React from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { ISelectOption } from 'common/models';
import styles from './style.module.scss';

interface ISelectProps {
  options: ISelectOption[];
  label?: string;
  value: string;
  width?: string;
  onChange?: any;
  name?: string;
  disabled?: boolean;
  align?: string;
  placeholder?: string;
  isRequired?: boolean;
}

const Select: React.FC<ISelectProps> = ({
  options,
  label,
  value,
  onChange,
  width,
  name,
  disabled,
  align,
  placeholder,
  isRequired,
}) => (
  <div className={styles.container} style={{ alignItems: align || '' }}>
    <span className={styles.label}>{label}</span>
    {!value ? (
      <span
        className={styles.placeholder}
        style={label?.length ? { top: 40 } : {}}
      >
        {placeholder}
      </span>
    ) : null}
    <TextField
      id="select"
      style={{ width }}
      variant="outlined"
      size="small"
      select={true}
      value={value}
      onChange={onChange}
      fullWidth={true}
      name={name}
      disabled={disabled}
      required={isRequired}
      SelectProps={{
        native: Boolean(isRequired),
      }}
    >
      {options.map((option: ISelectOption, index: number) =>
        isRequired ? (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ) : (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        )
      )}
    </TextField>
  </div>
);

export default Select;
