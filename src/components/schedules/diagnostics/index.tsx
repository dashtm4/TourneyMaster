import React, { Component } from 'react';
import { Modal } from 'components/common';
import styles from './styles.module.scss';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

interface Props {
  isOpen: boolean;
  scheduling: any;
  onClose: () => void;
}

class Diagnostics extends Component<Props> {
  render() {
    const { isOpen, onClose } = this.props;
    const align = 'center';

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Paper className={styles.root}>
          <TableContainer className={styles.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align={align} style={{ minWidth: 130 }}>
                    asd
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell align={align}>CELL</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> */}
        </Paper>
      </Modal>
    );
  }
}

export default Diagnostics;
