import React from 'react';
import { Link } from 'react-router-dom';
import { Paper } from 'components/common';
import { getIcon } from 'helpers';
import { Routes, Icons } from 'common/enums';
import styles from './styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

const Navigation = () => (
  <section className={styles.paper}>
    <Paper>
      <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
        {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
      </Link>
    </Paper>
  </section>
);

export default Navigation;
