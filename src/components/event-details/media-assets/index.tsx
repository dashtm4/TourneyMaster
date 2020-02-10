import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import styles from '../styles.module.scss';
import FileUpload from 'components/common/file-upload';

const MediaAssetsSection: React.FC = () => {
  const onDesktopIconUpload = (files: File[]) => console.log(files);
  const onMobileIconUpload = (files: File[]) => console.log(files);

  return (
    <SectionDropdown type="section" padding="0">
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Media Assets</span>
      </HeadingLevelThree>
      <div className={styles['ma-details']}>
        <div className={styles.uploadWrapper}>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Desktop Icon</span>
            <FileUpload onUpload={onDesktopIconUpload} />
          </div>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Mobile Icon</span>
            <FileUpload onUpload={onMobileIconUpload} />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default MediaAssetsSection;
