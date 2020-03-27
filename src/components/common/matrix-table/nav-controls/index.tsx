import React from 'react';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  zoomIn: BindingAction;
  zoomOut: BindingAction;
}

const NavControls = ({ zoomIn, zoomOut }: Props) => (
  <p className={styles.zoomCntrols}>
    <button className={styles.zoomIn} onClick={zoomIn}>
      &#43;
      <span className="visually-hidden">Zoom in</span>
    </button>
    <button className={styles.zoomOut} onClick={zoomOut}>
      &#45;
      <span className="visually-hidden">Zoom out</span>
    </button>
  </p>
);

export default NavControls;
