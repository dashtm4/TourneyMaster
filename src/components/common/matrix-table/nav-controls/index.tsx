import React from 'react';
import { openFullscreen, closeFullscreen } from 'helpers';
import { BindingAction } from 'common/models';
import { Icons } from 'common/enums';
import { getIcon } from 'helpers';
import styles from './styles.module.scss';

const FULL_SCREEN_ICON_STYLES = {
  fill: '#6a6a6a',
};

interface Props {
  zoomIn: BindingAction;
  zoomOut: BindingAction;
}

const NavControls = ({ zoomIn, zoomOut }: Props) => {
  const [isFullScreen, changeFullScreen] = React.useState(false);

  const onChangeFoolScreen = () => {
    isFullScreen ? closeFullscreen() : openFullscreen(document.documentElement);

    changeFullScreen(!isFullScreen);
  };

  return (
    <div className={styles.zoomCntrols}>
      <p className={styles.zoomBtnsWrapper}>
        <button className={styles.zoomIn} onClick={zoomIn}>
          &#43;
          <span className="visually-hidden">Zoom in</span>
        </button>
        <button className={styles.zoomOut} onClick={zoomOut}>
          &#45;
          <span className="visually-hidden">Zoom out</span>
        </button>
      </p>
      <button onClick={onChangeFoolScreen} className={styles.fullScreen}>
        {getIcon(
          isFullScreen ? Icons.FULL_SCREEN_EXIT : Icons.FULL_SCREEN,
          FULL_SCREEN_ICON_STYLES
        )}
        <span className="visually-hidden">Full screen</span>
      </button>
    </div>
  );
};

export default NavControls;
