import React from 'react';
import {
  BindingAction,
  BindingCbWithOne,
} from '../../../common/models/callback';
import withSelectColor from './hocs/withSelectColor';
import styles from './styles.module.scss';
const MUIColorPicker = require('material-ui-color-picker').default;

export interface Props {
  value: string;
  onChange: BindingAction | BindingCbWithOne<string>;
}

const ColorPicker = ({ value, onChange }: Props) => {
  return (
    <div className={styles.ColorPickerWrapper}>
      <div
        className={styles.ColorPickerBtn}
        style={{ backgroundColor: `#${value}` }}
      >
        <span className="visually-hidden">Select Color</span>
      </div>
      <div className={styles.ColorPicker}>
        <MUIColorPicker
          name="color"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          defaultValue={`#${value}`}
          onChange={(color: string) => onChange(color || `#${value}`)}
        />
      </div>
    </div>
  );
};

export default withSelectColor(ColorPicker);
