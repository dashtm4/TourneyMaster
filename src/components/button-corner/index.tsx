import React from 'react'
import { BindingAction } from '../../models/callback';
import style from './styles.module.scss'

interface Props {
  isActive: boolean;
  onClick: BindingAction;
  styles?: Object 
}

const ButtonCorner = ({ isActive, onClick, styles }: Props) => (
  <button
    className={`${style.cornerBtn} ${isActive ? style.cornerBtnActive : ''}`}
    onClick={onClick}
    style={styles}>
    <span className="visually-hidden">Open section</span>
  </button>
)

export default ButtonCorner;
