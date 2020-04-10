import React from 'react';
import { Link } from 'react-router-dom';

import { Button, Paper } from 'components/common';
import { getIcon } from 'helpers';
import { ButtonColors, ButtonVarian, Routes, Icons } from 'common/enums';
import { BindingAction } from 'common/models';
import styles from '../styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  isEventId: boolean;
  onCsvLoaderBtn: BindingAction;
  onCancelClick: BindingAction;
  onSave: BindingAction;
}

const Navigation = ({
  isEventId,
  onCsvLoaderBtn,
  onCancelClick,
  onSave,
}: Props) => (
  <Paper sticky={true}>
    <div className={styles.paperWrapper}>
      <div>
        {isEventId && (
          <Button
            onClick={onCsvLoaderBtn}
            color={ButtonColors.SECONDARY}
            variant={ButtonVarian.TEXT}
            label="Import from CSV"
          />
        )}
        <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
          {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
        </Link>
      </div>
      <div>
        <Button
          color={ButtonColors.SECONDARY}
          variant={ButtonVarian.TEXT}
          onClick={onCancelClick}
          label="Cancel"
        />
        <Button
          color={ButtonColors.PRIMARY}
          variant={ButtonVarian.CONTAINED}
          onClick={onSave}
          label="Save"
        />
      </div>
    </div>
  </Paper>
);

export default Navigation;
