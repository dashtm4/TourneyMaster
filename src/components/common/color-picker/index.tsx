import React from 'react';
import { TwitterPicker } from 'react-color';
import { BindingAction } from '../../../models/callback';
import withSelectColor from './hocs/withSelectColor';
import styles from './styles.module.scss';

interface Props {
  activeColor: string;
  onChange: BindingAction;
}

const ColorPicker = ({ activeColor, onChange }: Props) => (
  <div className={styles.ColorPickerWrapper}>
    <button
      className={styles.ColorPickerBtn}
      style={{ backgroundColor: activeColor }}
    >
      <span className="visually-hidden">Select Color</span>
    </button>
    <div className={styles.ColorPicker}>
      <TwitterPicker
        width={'204px'}
        onChangeComplete={onChange}
        triangle={'top-right'}
      />
    </div>
  </div>
);

export default withSelectColor(ColorPicker);
