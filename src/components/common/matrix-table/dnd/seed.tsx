import React from 'react';
import styles from './styles.module.scss';
import { getContrastingColor } from '../helper';

interface Props {
  position: 1 | 2;
  seedId?: number;
  round?: number;
  showHeatmap: boolean;
  divisionHex?: string;
  divisionName?: string;
  dependsUpon?: number;
}

export default (props: Props) => {
  const {
    position,
    seedId,
    showHeatmap,
    divisionHex,
    divisionName,
    round,
    dependsUpon,
  } = props;

  const getDisplayName = (round?: number, depends?: number) => {
    if (!round || !depends) return;
    const key = round >= 0 ? 'Winner' : 'Loser';
    return `${key} Game ${depends}`;
  };

  return (
    <div
      className={`${styles.seedContainer} ${
        position === 1 ? styles.seedContainerTop : styles.seedContainerBottom
      } ${showHeatmap && styles.heatmap}`}
      style={
        (showHeatmap && {
          background: `#${divisionHex}`,
          color: getContrastingColor(divisionHex),
        }) ||
        {}
      }
    >
      {seedId
        ? `Seed ${seedId} (${divisionName})`
        : getDisplayName(round, dependsUpon)}
    </div>
  );
};
