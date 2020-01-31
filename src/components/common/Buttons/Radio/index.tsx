import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Radio as MuiRadio,
  FormControlLabel,
  RadioGroup,
  FormLabel,
} from '@material-ui/core';

const myTheme = createMuiTheme({
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

interface IRadioProps {
  options: string[];
  formLabel: string;
}

const Radio: React.FC<IRadioProps> = ({ options, formLabel }) => (
  <ThemeProvider theme={myTheme}>
    <FormLabel component="legend">{formLabel}</FormLabel>
    <RadioGroup aria-label="gender" name="gender1">
      {options.map((option: string, index: number) => (
        <FormControlLabel
          key={index}
          value={option}
          control={<MuiRadio color="primary" />}
          label={option}
        />
      ))}
    </RadioGroup>
  </ThemeProvider>
);

export default Radio;
