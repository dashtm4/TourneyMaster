import React from 'react';
import styles from './styles.module.scss';

interface Props {
  position: 1 | 2;
  seedId?: number;
  displayName?: string;
  showHeatmap: boolean;
  divisionHex?: string;
  divisionName?: string;
}

export default (props: Props) => {
  const {
    position,
    seedId,
    displayName,
    showHeatmap,
    divisionHex,
    divisionName,
  } = props;

  return (
    <div
      className={`${styles.seedContainer} ${
        position === 1 ? styles.seedContainerTop : styles.seedContainerBottom
      } ${showHeatmap && styles.heatmap}`}
      style={(showHeatmap && { background: `#${divisionHex}` }) || {}}
    >
      {seedId ? `Seed ${seedId} (${divisionName})` : displayName}
    </div>
  );
};
