import React from 'react';
import styles from './styles.module.scss';

interface IProps {
  step: number;
}

const selectStyle = (num: number) => {
  switch (num) {
    case 8:
      return styles.connectors8;
    case 4:
      return styles.connectors4;
    case 2:
      return styles.connectors2;
    default:
      return styles.connectors2;
  }
};

const BracketConnector = (props: IProps) => {
  const { step } = props;

  return (
    <div className={selectStyle(step)}>
      {[...Array(Math.round(step / 2))].map(() => (
        <div key={Math.random()} className={styles.connector} />
      ))}
    </div>
  );
};

export default BracketConnector;
