import React from 'react';
import Button from '../../../common/buttons/button';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import { BindingAction } from '../../../../common/models/callback';
import styles from './styles.module.scss';

interface Props {
  onClick: BindingAction;
  onCancelClick: BindingAction;
}

const Navigation = ({ onClick, onCancelClick }: Props) => (
  <p className={styles.wrapper}>
    <span className={styles.linkWrapper}>
      <Button
        icon={<GetAppIcon />}
        label="Load From Library"
        variant="text"
        color="secondary"
      />
      <Button
        icon={<PublishIcon />}
        label="Upload From File"
        variant="text"
        color="secondary"
      />
    </span>
    <span className={styles.btnsWrapper}>
      <Button
        onClick={onCancelClick}
        label="Cancel"
        variant="text"
        color="secondary"
      />
      <Button
        onClick={onClick}
        label="Save"
        variant="contained"
        color="primary"
      />
    </span>
  </p>
);

export default Navigation;
