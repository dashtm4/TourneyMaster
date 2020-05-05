import React, { CSSProperties } from 'react';
import { getIcon } from 'helpers';
import { Button, Toasts } from 'components/common';
import { ButtonColors, ButtonVarian, Icons } from 'common/enums';
import { copyToClipboard } from './helpers';
import styles from './styles.module.scss';

const COPY_ICON_STYLES = {
  height: '23px',
  marginLeft: '10px',
};

interface Props {
  copyString: string;
  label: string;
  color: ButtonColors;
  variant: ButtonVarian;
  isDisabled?: boolean;
  style?: CSSProperties;
}

const ButtonCopy = ({
  label,
  color,
  variant,
  copyString,
  isDisabled,
  style,
}: Props) => {
  const wrappedLabel = (
    <span className={styles.labelWrapper} style={style}>
      <span>{label}</span>
      {getIcon(Icons.FILE_COPY, COPY_ICON_STYLES)}
    </span>
  );

  const onClick = () => {
    copyToClipboard(copyString);

    Toasts.successToast('Successfully copied!');
  };

  return (
    <Button
      onClick={onClick}
      label={wrappedLabel}
      color={color}
      variant={variant}
      disabled={isDisabled}
    />
  );
};

export default ButtonCopy;
