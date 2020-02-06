import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import styles from '../styles.module.scss';

const MediaAssetsSection: React.FC = () => (
  <SectionDropdown type="section" padding="0">
    <HeadingLevelThree>
      <span className={styles.blockHeading}>Media Assets</span>
    </HeadingLevelThree>
    <div />
  </SectionDropdown>
);

export default MediaAssetsSection;
