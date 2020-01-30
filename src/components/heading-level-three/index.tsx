import React from 'react';
import styles from './styles.module.scss';

interface Props {
  children: string;
}

const HeadeingLevelThree = ({ children }: Props) => <h3 className={styles.heading}>{children}</h3>;

export default HeadeingLevelThree;
