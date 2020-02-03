import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField as MuiTextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        minWidth: 300,
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.2)',
        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: '#00A3EA',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        color: '#6A6A6A',
      },
    },
  },
});

interface ITextFieldProps {
  endAdornment?: string;
  startAdornment?: string;
  label: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: string;
  value?: string;
  onChange?: () => {};
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
      size="small"
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
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
  </ThemeProvider>
);

export default TextField;
