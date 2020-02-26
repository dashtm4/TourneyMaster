import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';

import FileUpload, {
  FileUploadTypes,
  AcceptFileTypes,
} from 'components/common/file-upload';
import { IIconFile } from '../logic/model';
import styles from '../styles.module.scss';

interface IProps {
  onFileUpload: (files: IIconFile[]) => void;
}

const MediaAssetsSection: React.FC<IProps> = ({ onFileUpload }) => {
  const onDesktopFileUpload = (files: File[]) =>
    onFileUpload(
      files?.map((file: File) => ({ file, destinationType: 'desktop_icon' }))
    );

  const onMobileFileUpload = (files: File[]) =>
    onFileUpload(
      files?.map((file: File) => ({ file, destinationType: 'mobile_icon' }))
    );

  return (
    <SectionDropdown
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
      useBorder={true}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Media Assets</span>
      </HeadingLevelThree>
      <div className={styles.maDetails}>
        <div className={styles.uploadWrapper}>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Desktop Icon</span>
            <FileUpload
              type={FileUploadTypes.SECTION}
              acceptTypes={[
                AcceptFileTypes.JPG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onDesktopFileUpload}
            />
          </div>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Mobile Icon</span>
            <FileUpload
              type={FileUploadTypes.SECTION}
              acceptTypes={[
                AcceptFileTypes.JPG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onMobileFileUpload}
            />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default MediaAssetsSection;
