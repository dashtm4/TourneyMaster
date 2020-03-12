import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';

import FileUpload, {
  FileUploadTypes,
  AcceptFileTypes,
} from 'components/common/file-upload';
import { EventMenuTitles } from 'common/enums';

import { IIconFile } from '../logic/model';
import { UploadLogoTypes } from '../state';
import styles from '../styles.module.scss';
import { BindingCbWithOne } from 'common/models';

interface IProps {
  onFileUpload: (files: IIconFile[]) => void;
  onFileRemove: (files: IIconFile[]) => void;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
  index: number;
}

const MediaAssetsSection: React.FC<IProps> = props => {
  const { onFileUpload, onFileRemove, expanded, index, onToggleOne } = props;

  const populateFileObj = (
    files: File[],
    destinationType: string
  ): IIconFile[] => files.map(file => ({ file, destinationType }));

  const onDesktopFileUpload = (files: File[]) =>
    onFileUpload(populateFileObj(files, UploadLogoTypes.DESKTOP));

  const onMobileFileUpload = (files: File[]) =>
    onFileUpload(populateFileObj(files, UploadLogoTypes.MOBILE));

  const onDesktopFileRemove = (files: File[]) =>
    onFileRemove(populateFileObj(files, UploadLogoTypes.DESKTOP));

  const onMobileFileRemove = (files: File[]) =>
    onFileRemove(populateFileObj(files, UploadLogoTypes.MOBILE));

  const onSectionToggle = () => {
    onToggleOne(index);
  };

  return (
    <SectionDropdown
      id={EventMenuTitles.MEDIA_ASSETS}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
      useBorder={true}
      expanded={expanded}
      onToggle={onSectionToggle}
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
                AcceptFileTypes.JPEG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onDesktopFileUpload}
              onFileRemove={onDesktopFileRemove}
            />
          </div>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Mobile Icon</span>
            <FileUpload
              type={FileUploadTypes.SECTION}
              acceptTypes={[
                AcceptFileTypes.JPG,
                AcceptFileTypes.JPEG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onMobileFileUpload}
              onFileRemove={onMobileFileRemove}
            />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default MediaAssetsSection;
