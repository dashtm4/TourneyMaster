import React from 'react';
import { HeadingLevelThree, Button } from 'components/common';
import styles from './styles.module.scss';
import { ButtonVarian, ButtonColors } from 'common/enums';

const ItemSchedules = () => {
  return (
    <li>
      <div className={styles.titleWrapper}>
        <HeadingLevelThree>
          <span>Schedules</span>
        </HeadingLevelThree>
      </div>
      <ul className={styles.scheduleList}>
        <li>
          <Button
            variant={ButtonVarian.TEXT}
            color={ButtonColors.SECONDARY}
            label="Master Schedule"
          />
        </li>
      </ul>
    </li>
  );
};

export default ItemSchedules;
