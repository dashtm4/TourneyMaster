import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';

const LibraryManager = () => (
  <section>
    <p className={styles.btnWrapper}>
      <Button label="Link Data" variant="contained" color="primary" />
    </p>
    <div className={styles.headingWrapper}>
      <HeadingLevelTwo>Library Manager</HeadingLevelTwo>
    </div>
    <ul className={styles.libraryList}>
      <li>
        <SectionDropdown>
          <span>Tournaments</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Facilities</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Registration</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Divisions & Pools</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Team Management</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Scheduling</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
      <li>
        <SectionDropdown>
          <span>Messaging</span>
          <p>Content</p>
        </SectionDropdown>
      </li>
    </ul>
  </section>
);

export default LibraryManager;
