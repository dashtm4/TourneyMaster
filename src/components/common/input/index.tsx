import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField as MuiTextField } from '@material-ui/core';

const myTheme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  palette: {
    primary: {
      main: '#1C315F',
    },
    secondary: {
      main: '#FF0F19',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '21px',
        textTransform: 'none',
        lineHeight: '22px',
      },
    },
  },
});

const TextField: React.FC = () => (
  <ThemeProvider theme={myTheme}>
    <MuiTextField label="Outlined" variant="outlined" />
  </ThemeProvider>
);

export default TextField;
