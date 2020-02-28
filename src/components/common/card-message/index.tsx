import React from 'react';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import WarningIcon from '@material-ui/icons/Warning';
import { CardMessageTypes } from './Types';
import styles from './styles.module.scss';

interface Props {
  children: string;
  type: string;
  style?: object;
}

const getIcon = (type: string) => {
  switch (type) {
    case CardMessageTypes.INFO:
      return <EmojiObjectsIcon />;
    case CardMessageTypes.WARNING:
      return <WarningIcon />;
  }

  return null;
};

const CardMessage = ({ children, type, style }: Props) => (
  <p className={styles.CardMessage} style={style}>
    {getIcon(type)}
    {children}
  </p>
);

export default CardMessage;
