import React from 'react';
import { getIcon } from 'helpers/get-icon.helper';
import styles from './styles.module.scss';

interface Props {
  children: string;
  type: string;
  style?: object;
  iconStyle?: object;
}

const CardMessage = ({ children, type, style, iconStyle }: Props) => (
  <p className={styles.CardMessage} style={style}>
    {getIcon(type, iconStyle)}
    <span>{children}</span>
  </p>
);

export default CardMessage;
