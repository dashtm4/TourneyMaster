import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from 'components/common';
import styles from './styles.module.scss';

interface IProps {
  icomingFiles?: File[];
  onUpload: (files: File[]) => void;
}

const FileUpload: React.FC<IProps> = ({ icomingFiles, onUpload }) => {
  const [files, setFiles] = useState<File[] | null>(icomingFiles || null);

  const onDrop = useCallback((uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    onUpload(uploadedFiles);
    // eslint-disable-next-line
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const showFiles = (): string => {
    return files ? files.map((file: File) => file.name).join(', ') : '';
  };

  const renderFiles = () => (
    <div className={styles.uploadedWrapper}>
      <span>Uploaded File:</span>
      {showFiles()}
    </div>
  );

  const renderWhileDragging = () => <span>Drop files here</span>;

  const renderUploader = () =>
    isDragActive ? (
      renderWhileDragging()
    ) : (
      <>
        <span>Drag & Drop files here</span>
        <span>or</span>

        <Button
          label="Browse files"
          color="primary"
          variant="contained"
          type="squared"
        />
      </>
    );

  return (
    <div className={styles.wrapper}>
      <div {...getRootProps()} className={styles.container}>
        {Boolean(!files?.length) && <FontAwesomeIcon icon={faUpload} />}

        {Boolean(files?.length) && renderFiles()}

        {Boolean(!files?.length) && renderUploader()}

        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default FileUpload;
