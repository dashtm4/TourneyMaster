import React from 'react';
import { Button } from 'components/common';
import styles from './styles.module.scss';

const Navigation = () => (
  <p className={styles.btnWrapper}>
    <Button label="Link Data" variant="contained" color="primary" />
  </p>
);

export default Navigation;
