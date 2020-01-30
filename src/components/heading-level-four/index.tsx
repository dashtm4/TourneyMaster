import React from 'react';
import { Typography, ThemeProvider, createMuiTheme } from '@material-ui/core';
import styles from './styles.module.scss';

interface Props {
  children: string;
}

const THEME = createMuiTheme({
  typography: {
    fontFamily: [
      'Open Sans',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 22
  }
});

const HeadeingLevelThree = ({ children }: Props) => (
  <ThemeProvider theme={THEME}>
    <Typography className={styles.heading} component="h4">
      {children}
    </Typography>
  </ThemeProvider>
);

export default HeadeingLevelThree;
