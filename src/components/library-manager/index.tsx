import React from 'react';
import Navigation from './components/navigation';
import Registration from './components/registration';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import styles from './styles.module.scss';

const LibraryManager = () => (
  <section>
    <Navigation />
    <div className={styles.headingWrapper}>
      <HeadingLevelTwo>Library Manager</HeadingLevelTwo>
    </div>
    <ul className={styles.libraryList}>
      <li>
        <Registration />
      </li>
    </ul>
  </section>
);

export default LibraryManager;
