import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Tooltip } from 'components/common';
import { TooltipMessageTypes } from 'components/common/tooltip-message/Types';

import styles from './styles.module.scss';

interface IProps {
  onUpload: (files: File[]) => void;
}

const FileUpload: React.FC<IProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[] | null>(null);

  const onDrop = useCallback((uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    onUpload(uploadedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const showFiles = (): string => {
    return files ? files.map((file: File) => file.name).join(', ') : '';
  };

  return (
    <div className={styles.wrapper}>
      <div {...getRootProps()} className={styles.container}>
        <FontAwesomeIcon icon={faUpload} />

        {isDragActive ? (
          <span>Drop files here</span>
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
        )}

        <input {...getInputProps()} />
      </div>
      {files?.length && (
        <Tooltip title={showFiles()} type={TooltipMessageTypes.INFO}>
          <div className={styles.filesWrapper}>
            <span>Files:&nbsp;</span>
            <span>{showFiles()}</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default FileUpload;
