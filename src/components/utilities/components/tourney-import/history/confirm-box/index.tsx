import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from 'components/common';
import { ButtonVarian, ButtonColors, ButtonFormTypes } from 'common/enums';
import { BindingAction } from 'common/models';

interface DeleteProps {
  opened: boolean;
  onNo: BindingAction;
  onYes: BindingAction;
}

interface RerunProps {
  opened: boolean;
  onNo: BindingAction;
  onYes: BindingAction;
}

export const DeleteComformBox = ({ opened, onNo, onYes }: DeleteProps) => {

  return (
    <div>
      <Dialog
        open={opened}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="alert-dialog-box"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want to delete this item?"}</DialogTitle>

        <DialogActions>
          <Button
            label="No"
            variant='text'
            onClick={onNo}
            color={ButtonColors.SECONDARY}
            btnType={ButtonFormTypes.SUBMIT}
          />
          <Button
            label="Yes"
            onClick={onYes}
            variant={ButtonVarian.CONTAINED}
            color={ButtonColors.PRIMATY}
            btnType={ButtonFormTypes.SUBMIT}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const RerunComfirmBox = ({ opened, onNo, onYes }: RerunProps) => {

  return (
    <div>
      <Dialog
        open={opened}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="alert-dialog-box"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want to re-run this item?"}</DialogTitle>

        <DialogActions>
          <Button
            label="No"
            variant='text'
            onClick={onNo}
            color={ButtonColors.SECONDARY}
            btnType={ButtonFormTypes.SUBMIT}
          />
          <Button
            label="Yes"
            variant={ButtonVarian.CONTAINED}
            onClick={onYes}
            color={ButtonColors.PRIMATY}
            btnType={ButtonFormTypes.SUBMIT}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
