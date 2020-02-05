import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';

const LibraryManaget = () => (
  <section>
    <p className={styles.btnWrapper}>
      <Button
        label="Link Data"
        variant="contained"
        color="primary"
        type="string"
      />
    </p>
    <div className={styles.headingWrapper}>
      <HeadingLevelTwo>Registration</HeadingLevelTwo>
    </div>
    <ul className={styles.libraryList}>
      <li>
        <SectionDropdown>
          <span>Primary Information</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Teams & Athletes</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Main Contact</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
    </ul>
  </section>
);

export default LibraryManaget;
