import React from 'react';
import { Button } from 'components/common';
import { ButtonVarian, ButtonColors } from 'common/enums';
import styles from './styles.module.scss';

const Navigation = () => (
  <p className={styles.btnWrapper}>
    <Button
      variant={ButtonVarian.CONTAINED}
      color={ButtonColors.PRIMARY}
      label="Link Data"
    />
  </p>
);

export default Navigation;
