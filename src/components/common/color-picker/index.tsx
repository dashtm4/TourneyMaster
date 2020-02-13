import React from 'react';
import { TwitterPicker } from 'react-color';
import {
  BindingAction,
  BindingCbWithOne,
} from '../../../common/models/callback';
import withSelectColor from './hocs/withSelectColor';
import styles from './styles.module.scss';

export interface Props {
  value: string;
  displayColorPicker: boolean;
  onClick: () => void;
  onChange: BindingAction | BindingCbWithOne<{ hex: string }>;
}

const ColorPicker = ({
  value,
  onChange,
  displayColorPicker,
  onClick,
}: Props) => {
  const colors = [
    '#1C315F',
    '#00A3EA',
    '#FF6900',
    '#FCB900',
    '#00D084',
    '#000000',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
  ];

  return (
    <div className={styles.ColorPickerWrapper}>
      <button
        className={styles.ColorPickerBtn}
        style={{ backgroundColor: value }}
        onClick={onClick}
      >
        <span className="visually-hidden">Select Color</span>
      </button>
      <div className={styles.ColorPicker}>
        {displayColorPicker && (
          <TwitterPicker
            colors={colors}
            width={'204px'}
            onChangeComplete={onChange}
            triangle={'top-right'}
          />
        )}
      </div>
    </div>
  );
};

export default withSelectColor(ColorPicker);
