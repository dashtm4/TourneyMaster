import React from 'react';
import styles from './styles.module.scss';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import WarningIcon from '@material-ui/icons/Warning';
import { CardMessageTypes } from './Types';

interface Props {
  children: string;
  type: string;
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

const CardMessage = ({ children, type }: Props) => (
  <p className={styles.CardMessage}>
    {getIcon(type)}
    {children}
  </p>
);

export default CardMessage;
