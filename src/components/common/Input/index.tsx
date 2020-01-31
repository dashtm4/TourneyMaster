import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField as MuiTextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from './style.module.sass';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  palette: {
    primary: {
      main: '#00A3EA',
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        minWidth: 300,
        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: '#00A3EA',
        },
      },
    },
  },
});

interface ITextFieldProps {
  endAdornment: string;
  startAdornment: string;
  label: string;
  fullWidth: boolean;
  multiline: boolean;
  rows: string;
  value: string;
  onChange: () => {};
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
}) => (
  <ThemeProvider theme={theme}>
    <MuiTextField
      fullWidth={fullWidth}
      label={label}
      variant="outlined"
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: endAdornment && (
          <InputAdornment position="start">
            {endAdornment === 'search' ? (
              <SearchIcon className={styles.inputAdornmentIcon} />
            ) : (
              endAdornment
            )}
          </InputAdornment>
        ),
        startAdornment: startAdornment && (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
      }}
    />
  </ThemeProvider>
);

export default TextField;
