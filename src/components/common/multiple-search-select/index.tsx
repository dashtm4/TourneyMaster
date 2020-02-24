/* tslint:disable: jsx-no-lambda */
import React from 'react';
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete';
import { Checkbox, TextField } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import styles from './styles.module.scss';

interface IProps {
  options: Partial<{ title: string }>[];
  placeholder: string;
  width?: number;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultipleSearchSelect = ({ options, placeholder, width }: IProps) => {
  return (
    <Autocomplete
      multiple={true}
      options={options}
      disableCloseOnSelect={true}
      getOptionLabel={(option: any) => option.title}
      renderOption={(option, { selected }) => (
        <>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.title}
        </>
      )}
      className={styles.autocomplete}
      style={{ width }}
      renderInput={(params: RenderInputParams) => (
        <TextField
          className={styles.input}
          {...params}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          fullWidth={true}
        />
      )}
    />
  );
};

export default MultipleSearchSelect;
