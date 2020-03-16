import React from 'react';
import { Checkbox } from 'components/common';
import { IDivision } from 'common/models';
import styles from './styles.module.scss';

const DEFAUL_DIVISION_COLOR = '#ffffff';

interface Props {
  divisions: IDivision[];
  isHeatmap: boolean;
  onHeatmapChange: (isHeatmap: boolean) => void;
}

const DivisionHeatmap = ({ divisions, isHeatmap, onHeatmapChange }: Props) => {
  const CHECKBOX_OPTION = { label: 'Division Heatmap', checked: isHeatmap };

  return (
    <form className={styles.form}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          options={[CHECKBOX_OPTION]}
          onChange={() => onHeatmapChange(!isHeatmap)}
        />
      </div>
      <ul className={styles.divisionsList}>
        {divisions.map(it => (
          <li className={styles.divisionItem} key={it.division_id}>
            <span
              className={styles.divisionColor}
              style={{
                backgroundColor: `#${it.division_hex}` || DEFAUL_DIVISION_COLOR,
              }}
            />
            {it.short_name}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default DivisionHeatmap;
