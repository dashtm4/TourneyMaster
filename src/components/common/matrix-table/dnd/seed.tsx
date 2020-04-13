import React from 'react';
import styles from './styles.module.scss';

interface Props {
  seedId?: number;
  displayName?: string;
  showHeatmap: boolean;
  divisionHex?: string;
  divisionName?: string;
}

export default (props: Props) => {
  const { seedId, displayName, showHeatmap, divisionHex, divisionName } = props;

  return (
    <div
      className={`${styles.seedContainer} ${showHeatmap && styles.heatmap}`}
      style={(showHeatmap && { background: `#${divisionHex}` }) || {}}
    >
      {seedId ? `Seed ${seedId} (${divisionName})` : displayName}
    </div>
  );
};
