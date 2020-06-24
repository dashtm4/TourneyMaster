import React from 'react';
import { Button } from 'components/common';
import FabButton from 'components/common/fab-button';
import { ButtonTypes, ButtonVarian, ButtonColors } from 'common/enums';
import { BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  isEnterScores: boolean;
  isFullScreen: boolean;
  onChangeView: (flag: boolean) => void;
  onLeavePage: BindingAction;
  onSaveDraft: BindingAction;
}

const Navigation = ({
  isEnterScores,
  isFullScreen,
  onChangeView,
  onLeavePage,
  onSaveDraft,
}: Props) => {
  const onFalseView = () => onChangeView(false);
  const onTrueView = () => onChangeView(true);

  return (
    <div className={styles.navWrapper}>
      <p className={styles.btnsViewWrapper}>
        <span className={styles.btnWrapper}>
          <Button
            onClick={onFalseView}
            type={
              isEnterScores ? ButtonTypes.SQUARED_OUTLINED : ButtonTypes.SQUARED
            }
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMARY}
            label="View Only"
          />
        </span>
        <Button
          onClick={onTrueView}
          type={
            isEnterScores ? ButtonTypes.SQUARED : ButtonTypes.SQUARED_OUTLINED
          }
          variant={ButtonVarian.CONTAINED}
          color={ButtonColors.PRIMARY}
          label="Enter Scores"
        />
      </p>
      <p className={styles.btnsSaveWrapper}>
        {!isFullScreen && (
          <span className={styles.btnWrapper}>
            <Button
              onClick={onLeavePage}
              variant={ButtonVarian.TEXT}
              color={ButtonColors.SECONDARY}
              label="Close"
            />
            <FabButton
              onClick={onLeavePage}
              sequence={1}
              label="Cancel"
              variant="outlined"
            />
          </span>
        )}
        <span className={styles.btnWrapper}>
          <Button
            onClick={onSaveDraft}
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMARY}
            label="Save"
          />
          <FabButton
            onClick={onSaveDraft}
            sequence={2}
            label="Save"
            variant="contained"
          />
        </span>
      </p>
    </div>
  );
};
export default Navigation;
