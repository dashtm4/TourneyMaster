import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button as MuiButton } from '@material-ui/core';
import styles from './style.module.scss';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans',
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#1C315F',
    },
    secondary: {
      main: '#00A3EA',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '21px',
        textTransform: 'none',
      },
    },
  },
});

interface IButtonProps {
  label: string;
  color: 'primary' | 'secondary' | 'inherit' | 'default' | undefined;
  variant: 'text' | 'outlined' | 'contained' | undefined;
  type?: string;
  onClick?: () => {};
}

const Button: React.FC<IButtonProps> = ({
  label,
  color,
  variant,
  type,
  onClick,
}) => (
  <ThemeProvider theme={theme}>
    <MuiButton
      variant={variant}
      color={color}
      className={type && styles[`${type}Btn`]}
      onClick={onClick}
    >
      {label}
    </MuiButton>
  </ThemeProvider>
);

export default Button;
