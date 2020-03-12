import React from 'react';
import Navigation from './components/navigations';
import EditProfile from './components/edit-profile';
import { HeadingLevelTwo } from 'components/common';
import styles from './styles.module.scss';

const Utilities = () => (
  <section>
    <form
      onSubmit={evt => {
        evt.preventDefault();
      }}
    >
      <Navigation />
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>Utilities</HeadingLevelTwo>
      </div>
      <EditProfile />
    </form>
  </section>
);

export default Utilities;
