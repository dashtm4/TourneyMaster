import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField as MuiTextField, MenuItem } from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  palette: {
    primary: {
      main: '#00A3EA',
    },
  },
});

interface ISelectProps {
  options: string[];
  label: string;
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
  <ThemeProvider theme={theme}>
    <MuiTextField
      id="select"
      style={{ width: width || '100px' }}
      variant="outlined"
      size="small"
      select={true}
      label={label}
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
  </ThemeProvider>
);

export default Select;
