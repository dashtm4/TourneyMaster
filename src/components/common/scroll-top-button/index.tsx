import React from 'react';
import { Button } from 'components/common';
import styles from './styles.module.scss';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const ScrollTopButton = () => {
  return (
    <div className={styles.btnContainer}>
      <Button
        label={<span className="visually-hidden">Scroll Top</span>}
        variant="text"
        color="secondary"
        type={'icon'}
        onClick={() => window.scrollTo(0, 0)}
        icon={<KeyboardArrowUpIcon fontSize="large" />}
      />
    </div>
  );
};

export default ScrollTopButton;
