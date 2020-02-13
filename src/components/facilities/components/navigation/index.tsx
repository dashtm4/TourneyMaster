import React from 'react';
import Button from '../../../common/buttons/button';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import { BindingAction } from '../../../../common/models/callback';
import styles from './styles.module.scss';

interface Props {
  onClick: BindingAction;
}

const Navigation = ({ onClick }: Props) => (
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
    <Button
      onClick={onClick}
      label="Save"
      variant="contained"
      color="primary"
    />
  </p>
);

export default Navigation;
