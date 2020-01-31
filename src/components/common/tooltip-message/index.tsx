import React from 'react';
import styles from './styles.module.scss';
import { TooltipMessageTypes } from './Types'

interface Props {
  children: string;
  type: string
}

const getColor = (type: string) => {
  switch (type) {
    case TooltipMessageTypes.INFO:
      return 'inherit'
    case TooltipMessageTypes.WARNING:
      return '#FF0F19'
  }

  return ''
}

const TooltipMessage = ({ children, type }: Props) => (
  <p
    className={styles.TooltipMessage}
    style={{ color: getColor(type) }}>
    {children}
  </p>
)

export default TooltipMessage
