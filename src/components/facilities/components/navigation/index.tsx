import React from 'react';
import Button from '../../../common/buttons/button';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import styles from './styles.module.scss';

const Navigation = () => (
  <p className={styles.wrapper}>
    <span className={styles.linkWrapper}>
      <a href="#" className={styles.loadLink}>
        <GetAppIcon />
        Load From Library
      </a>
      <a href="#" className={styles.uploadLink}>
        <PublishIcon />
        Upload From File
      </a>
    </span>
    <Button label="Save" variant="contained" color="primary" />
  </p>
);

export default Navigation;
