import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Paper, Button } from 'components/common';
import styles from './styles.module.scss';

interface Props {
  isAllowCreate: boolean;
}

const Navigation = ({ isAllowCreate }: Props) => (
  <section className={styles.paper}>
    <Paper>
      <div>
        <Button
          icon={<FontAwesomeIcon icon={faFileExport} />}
          label="Load From Library"
          color="secondary"
          variant="text"
          disabled={!isAllowCreate}
        />
        &nbsp;
        <Button
          icon={<FontAwesomeIcon icon={faFileUpload} />}
          label="Upload From File"
          color="secondary"
          variant="text"
          disabled={!isAllowCreate}
        />
      </div>
    </Paper>
  </section>
);

export default Navigation;
