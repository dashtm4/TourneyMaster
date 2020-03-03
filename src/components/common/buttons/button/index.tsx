import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styles from './style.module.scss';

interface IButtonProps {
  label: string | JSX.Element;
  color: 'primary' | 'secondary' | 'inherit' | 'default' | undefined;
  variant: 'text' | 'outlined' | 'contained' | undefined;
  type?: 'squared' | 'danger' | 'squaredOutlined' | 'dangerLink' | undefined;
  btnType?: 'button' | 'submit';
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
  btnType,
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
    type={btnType || 'button'}
  >
    <div className={icon && styles.iconWrapper}>{icon}</div>
    {label}
  </MuiButton>
);

export default Button;
