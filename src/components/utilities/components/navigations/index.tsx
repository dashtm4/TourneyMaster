import React from 'react';
import { Button } from 'components/common';
import { ButtonVarian, ButtonColors, ButtonFormTypes } from 'common/enums';
import styles from './styles.module.scss';

const Navigation = () => (
  <p className={styles.wrapper}>
    <Button
      label="Save"
      variant={ButtonVarian.CONTAINED}
      color={ButtonColors.PRIMATY}
      btnType={ButtonFormTypes.SUBMIT}
    />
  </p>
);

export default Navigation;
