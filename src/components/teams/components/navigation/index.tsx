import React from 'react';
import Button from '../../../common/buttons/button';
import { getIcon } from '../../../../helpers/get-icon.helper';
import { Icons } from '../../../../common/constants/icons';
import { BindingAction } from '../../../../common/models';
import styles from './styles.module.scss';

const ICON_STYLES = {
  marginRight: '5px',
};

interface Props {
  isEdit: boolean;
  onEditClick: BindingAction;
}

const Navigation = ({ isEdit, onEditClick }: Props) => (
  <div className={styles.navWrapper}>
    <p>
      <Button
        icon={getIcon(Icons.GET_APP, ICON_STYLES)}
        label="Load From Library"
        variant="text"
        color="secondary"
      />
      <Button
        icon={getIcon(Icons.PUBLISH, ICON_STYLES)}
        label="Upload From File"
        variant="text"
        color="secondary"
      />
    </p>
    {isEdit ? (
      <p>
        <Button
          onClick={onEditClick}
          label="Cancel"
          variant="text"
          color="secondary"
        />
        <span className={styles.btnWrapper}>
          <Button label="Save" variant="contained" color="primary" />
        </span>
      </p>
    ) : (
      <p>
        <Button
          onClick={onEditClick}
          icon={getIcon(Icons.EDIT, ICON_STYLES)}
          label="Arrange Teams"
          variant="text"
          color="secondary"
        />
        <span className={styles.btnWrapper}>
          <Button label="Create Team" variant="contained" color="primary" />
        </span>
      </p>
    )}
  </div>
);

export default Navigation;