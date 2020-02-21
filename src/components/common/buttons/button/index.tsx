import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styles from './style.module.scss';

interface IButtonProps {
  label: string | JSX.Element;
  color: 'primary' | 'secondary' | 'inherit' | 'default' | undefined;
  variant: 'text' | 'outlined' | 'contained' | undefined;
  type?: 'squared' | 'danger' | 'squaredOutlined' | undefined;
  btnStyles?: object;
  icon?: JSX.Element;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Button: React.FC<IButtonProps> = ({
  label,
  color,
  variant,
  type,
  onClick,
  icon,
  disabled,
  btnStyles,
}) => (
  <MuiButton
    disabled={disabled}
    variant={variant}
    color={color}
    className={type && styles[`${type}Btn`]}
    onClick={onClick}
    style={{ fontSize: '16px', ...btnStyles }}
  >
    <div className={styles.iconWrapper}>{icon}</div>
    {label}
  </MuiButton>
);

export default Button;
