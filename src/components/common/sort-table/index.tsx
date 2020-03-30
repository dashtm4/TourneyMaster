import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHeader from './components/table-header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { getComparator, stableSort } from './helpers';
import { ITableSortRow, OrderTypes, TableSortRowTypes } from './common';
import styles from './styles.module.scss';

const useStyles = makeStyles({
  tableRowEven: {
    backgroundColor: '#F7F7F7',
  },
  tableRowOdd: {
    backgroundColor: '#ffffff',
  },
  tableTitle: {
    color: '#00A3EA;',
  },
});
interface Props {
  rows: ITableSortRow[];
}

const SortTable = ({ rows }: Props) => {
  const classes = useStyles();

  const [order, setOrder] = React.useState<OrderTypes>(OrderTypes.ASC);
  const [orderBy, setOrderBy] = React.useState<TableSortRowTypes>(
    TableSortRowTypes.TITLE
  );

  const handleRequestSort = (property: TableSortRowTypes) => {
    const isAsc = orderBy === property && order === OrderTypes.ASC;

    setOrder(isAsc ? OrderTypes.DESC : OrderTypes.ASC);

    setOrderBy(property);
  };

  const sorteRows = stableSort(rows, getComparator(order, orderBy));

  return (
    <div className={styles.tableWrapper}>
      <TableContainer>
        <Table>
          <TableHeader
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {sorteRows.map((row: ITableSortRow, idx: number) => (
              <TableRow
                key={row.id}
                className={
                  idx % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd
                }
                hover
              >
                <TableCell className={classes.tableTitle}>
                  {row.title}
                </TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{moment(row.lastModified).format('lll')}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SortTable;
