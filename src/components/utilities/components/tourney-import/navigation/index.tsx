import React from 'react';
import { Button } from 'components/common';
import { BindingAction } from 'common/models';
import { ButtonVarian, ButtonColors, ButtonFormTypes } from 'common/enums';
import styles from './styles.module.scss';

interface Props {
  onPreview: BindingAction;
  dataLoaded: Boolean;
}

export const Navigation = ({ onPreview, dataLoaded }: Props) => {
  // function onCommitData() {
  //   const data = getData('events');
  //   console.log(data);
  // }

  // async function getData(dataType: String) {
  //   const data = await Api.get(`/ext_${dataType}?IDTournament=${idTournament}`);
  //   return data;
  // }

  return (
    dataLoaded ? (
      <div className={styles.wrapper}>
        <div className={styles.buttonGroup}>
          <Button
            label="Cancel"
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.SECONDARY}
            btnType={ButtonFormTypes.SUBMIT}
          />
          <Button
            label="Commit"
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMATY}
            btnType={ButtonFormTypes.SUBMIT}
          />
        </div>
      </div>
    ) : (
        <div className={styles.wrapper}>
          <Button
            onClick={onPreview}
            label="Preview"
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMATY}
            btnType={ButtonFormTypes.SUBMIT}
          />
        </div>
      )
  )
};