import React from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { BindingAction } from '../../../common/models/callback';

interface Props {
  isOpen: boolean;
  onClose: BindingAction;
  children: React.ReactElement;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
);

const ModalRoot = ({ isOpen, onClose, children }: Props) => (
  <Modal
    className={useStyles().modal}
    onClose={onClose}
    open={isOpen}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{ timeout: 500 }}
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
  >
    <Fade in={isOpen}>{children}</Fade>
  </Modal>
);

export default ModalRoot;
