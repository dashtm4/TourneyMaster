import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button as MuiButton } from '@material-ui/core';

const myTheme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 16,
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

interface IButtonProps {
  label: string;
  color: 'primary' | 'secondary' | 'inherit' | 'default' | undefined;
}

const Button: React.FC<IButtonProps> = ({ label, color }) => (
  <ThemeProvider theme={myTheme}>
    <MuiButton variant="contained" color={color}>
      {label}
    </MuiButton>
  </ThemeProvider>
);

export default Button;
