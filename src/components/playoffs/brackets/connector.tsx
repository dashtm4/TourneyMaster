import React from 'react';
import styles from './styles.module.scss';

interface IProps {
  step: number;
  round: number;
  hidden?: any[];
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

const getHiddenStyle = (hiddenTop: boolean, hiddenBottom: boolean) => {
  switch (true) {
    case hiddenTop && hiddenBottom:
      return styles.hidden;
    case hiddenTop && !hiddenBottom:
      return styles.hiddenTop;
    case !hiddenTop && hiddenBottom:
      return styles.hiddenBottom;
  }
};

const BracketConnector = (props: IProps) => {
  const { step, hidden, round } = props;

  const renderConnector = () => (
    <div
      key={Math.random()}
      className={`${styles.connector} ${round <= 0 &&
        styles.negativeConnector}`}
    />
  );

  return (
    <div className={selectStyle(step)}>
      {hidden &&
        hidden.map(({ hiddenTop, hiddenBottom }) => (
          <div
            key={Math.random()}
            className={`${styles.connector} ${getHiddenStyle(
              hiddenTop,
              hiddenBottom
            )}`}
          />
        ))}

      {!hidden &&
        round <= 0 &&
        [...Array(Math.round(step / 2))].map(renderConnector)}

      {!hidden &&
        round > 0 &&
        [...Array(Math.floor(step / 2))].map(renderConnector)}
    </div>
  );
};

export default BracketConnector;
