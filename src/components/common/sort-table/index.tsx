import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHeader from './components/table-header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { getComparator, stableSort } from './helpers';
import { OrderTypes } from './types';
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
  rows: any[];
  titleField: string;
}

const SortTable = ({ rows, titleField }: Props) => {
  const classes = useStyles();

  const [order, setOrder] = React.useState<OrderTypes>(OrderTypes.ASC);
  const [orderBy, setOrderBy] = React.useState<string>(titleField);

  const handleRequestSort = (property: string) => {
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
            titleField={titleField}
          />
          <TableBody>
            {sorteRows.map((row, idx) => (
              <TableRow
                key={row[titleField]}
                className={
                  idx % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd
                }
                hover
              >
                <TableCell className={classes.tableTitle}>
                  {row[titleField]}
                </TableCell>
                <TableCell>1</TableCell>
                <TableCell>{row.lastModified}</TableCell>
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
