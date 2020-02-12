import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styles from './style.module.scss';

interface IButtonProps {
  label: string;
  color: 'primary' | 'secondary' | 'inherit' | 'default' | undefined;
  variant: 'text' | 'outlined' | 'contained' | undefined;
  type?: 'squared' | 'danger' | 'squaredOutlined';
  icon?: any;
  onClick?: any;
}

const Button: React.FC<IButtonProps> = ({
  label,
  color,
  variant,
  type,
  onClick,
  icon,
}) => (
  <MuiButton
    variant={variant}
    color={color}
    className={type && styles[`${type}Btn`]}
    onClick={onClick}
  >
    {icon} {label}
  </MuiButton>
);

export default Button;
