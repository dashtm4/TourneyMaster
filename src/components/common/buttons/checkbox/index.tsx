import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@material-ui/core';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#00A3EA',
    },
  },
  overrides: {
    MuiFormControlLabel: {
      root: {
        lineHeight: '22px',
        color: '#6A6A6A',
      },
    },
  },
});

interface ICheckboxProps {
  options: string[];
  formLabel?: string;
  onChange?: () => void;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  options,
  formLabel,
  onChange,
}) => (
  <ThemeProvider theme={theme}>
    <FormLabel component="legend">{formLabel}</FormLabel>
    <FormGroup>
      {options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          control={<MuiCheckbox value={option} color="primary" />}
          label={option}
          onChange={onChange}
        />
      ))}
    </FormGroup>
  </ThemeProvider>
);

export default Checkbox;
