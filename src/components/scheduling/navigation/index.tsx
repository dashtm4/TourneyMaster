import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { Paper, Button } from 'components/common';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  isAllowCreate: boolean;
  onCreatePressed: BindingAction
}

const Navigation = ({ isAllowCreate, onCreatePressed }: Props) => (
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
      <Button
        label="Create New Version"
        color="primary"
        variant="contained"
        onClick={onCreatePressed}
        disabled={!isAllowCreate}
      />
    </Paper>
  </section>
);

export default Navigation;
