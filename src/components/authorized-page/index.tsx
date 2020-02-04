import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../header';
import Menu from '../common/menu';
import LibraryManaget from '../library-manager';
import Facilities from '../facilities';
import MenuList from './constants/MenuList';
import { Routes } from '../../common/constants';
import styles from './styles.module.scss';

const AuthorizedPage = () => (
  <>
    <Header />
    <div className={styles.page}>
      <Menu list={MenuList} />
      <main className={styles.content}>
        <Switch>
          <Route path={Routes.LIBRARY_MANAGER} component={LibraryManaget} />
          <Route path={Routes.FACILITIES} component={Facilities} />
        </Switch>
      </main>
    </div>
  </>
);

export default AuthorizedPage;
