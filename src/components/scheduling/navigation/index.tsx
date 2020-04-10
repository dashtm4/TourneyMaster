import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button } from 'components/common';
import { getIcon } from 'helpers';
import { BindingAction } from 'common/models';
import { ButtonColors, ButtonVarian, Routes, Icons } from 'common/enums';
import styles from './styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};
interface Props {
  isAllowCreate: boolean;
  onCreatePressed: BindingAction;
}

const Navigation = ({ isAllowCreate, onCreatePressed }: Props) => (
  <section className={styles.paper}>
    <Paper>
      <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
        {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
      </Link>
      <Button
        onClick={onCreatePressed}
        color={ButtonColors.PRIMARY}
        variant={ButtonVarian.CONTAINED}
        disabled={!isAllowCreate}
        label="Create New Version"
      />
    </Paper>
  </section>
);

export default Navigation;
