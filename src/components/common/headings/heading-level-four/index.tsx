import React from 'react';
import { Typography, ThemeProvider, createMuiTheme } from '@material-ui/core';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactElement;
}

const THEME = createMuiTheme({
  typography: {
    fontFamily: ['Open Sans', 'Arial', 'sans-serif'].join(','),
    fontSize: 22,
  },
  overrides: {
    MuiTypography: {
      root: {
        color: '#1C315F',
      },
    },
  },
});

const HeadeingLevelThree = ({ children }: Props) => (
  <ThemeProvider theme={THEME}>
    <Typography className={styles.heading} component="h4">
      {children}
    </Typography>
  </ThemeProvider>
);

export default HeadeingLevelThree;
