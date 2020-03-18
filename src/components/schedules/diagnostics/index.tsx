import React, { Component, ReactText } from 'react';
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
  TableSortLabel,
} from '@material-ui/core';
import { orderBy } from 'lodash-es';

export interface IDiagnosticsInput {
  header: string[];
  body: Cell[][];
}

interface Props {
  isOpen: boolean;
  tableData: IDiagnosticsInput;
  onClose: () => void;
}

interface State {
  sortBy: string;
  sortOrder: string;
  tableData: IDiagnosticsInput;
}

type Cell = ReactText | undefined;

enum sortOrderEnum {
  asc = 1,
  desc = 2,
}

class Diagnostics extends Component<Props, State> {
  state = {
    sortOrder: sortOrderEnum[1],
    sortBy: '',
    tableData: this.props.tableData,
  };

  sortData = (sortByArg: string, sortOrderArg?: 'asc' | 'desc') => {
    const sortBy = this.state.tableData.header.indexOf(sortByArg);

    this.setState(({ sortOrder, tableData }) => ({
      sortBy: sortByArg,
      sortOrder:
        sortOrderArg || sortOrderEnum[sortOrder] === 1
          ? sortOrderEnum[2]
          : sortOrderEnum[1],
      tableData: {
        ...tableData,
        body: orderBy(
          tableData.body,
          sortBy,
          sortOrder === 'asc' ? 'asc' : 'desc'
        ),
      },
    }));
  };

  createTableCell = (cellText: Cell, index: number, isHeader?: boolean) => (
    <TableCell
      className={styles.tableCell}
      key={'cell-' + index}
      align="center"
    >
      {cellText}

      {isHeader && (
        <TableSortLabel
          active={cellText === this.state.sortBy}
          direction={this.state.sortOrder === 'asc' ? 'desc' : 'asc'}
          onClick={() => this.sortData(String(cellText))}
        />
      )}
    </TableCell>
  );

  createTableRow = (cells: Cell[], index?: number, isHeader?: boolean) => (
    <TableRow key={index} hover={true}>
      {cells.map((cell: Cell, cellIndex: number) =>
        this.createTableCell(cell, cellIndex, isHeader)
      )}
    </TableRow>
  );

  render() {
    const { isOpen, onClose } = this.props;
    const { tableData } = this.state;
    const { header, body } = tableData;

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Paper className={styles.root}>
          <TableContainer className={styles.container}>
            <Table stickyHeader={true} aria-label="sticky table">
              <TableHead>
                {this.createTableRow(header, undefined, true)}
              </TableHead>
              <TableBody>
                {body.map((element, index) =>
                  this.createTableRow(element, index)
                )}
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
