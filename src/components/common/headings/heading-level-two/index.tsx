import React from 'react';
import { Typography } from '@material-ui/core';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactElement;
}

const HeadeingLevelTwo = ({ children }: Props) => (
  <Typography className={styles.heading} component="h2">
    {children}
  </Typography>
);

export default HeadeingLevelTwo;
