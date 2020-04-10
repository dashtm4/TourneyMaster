import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button } from 'components/common';
import { getIcon } from 'helpers';
import { IRegistration, BindingAction } from 'common/models';
import { ButtonVarian, ButtonColors, Routes, Icons } from 'common/enums';
import styles from '../styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  registration: IRegistration;
  onRegistrationEdit: BindingAction;
}

const Navigation = ({ registration, onRegistrationEdit }: Props) => (
  <Paper sticky={true}>
    <div className={styles.mainMenu}>
      <Link className={styles.libraryBtn} to={Routes.LIBRARY_MANAGER}>
        {getIcon(Icons.GET_APP, ICON_STYLES)} Load From Library
      </Link>
      <Button
        variant={ButtonVarian.CONTAINED}
        color={ButtonColors.PRIMARY}
        onClick={onRegistrationEdit}
        label={registration ? 'Edit' : 'Add'}
      />
    </div>
  </Paper>
);

export default Navigation;
