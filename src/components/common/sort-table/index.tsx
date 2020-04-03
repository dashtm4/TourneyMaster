import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHeader from './components/table-header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { Button } from 'components/common';
import { getComparator, stableSort } from './helpers';
import { ITableSortRow, OrderTypes, TableSortRowTypes } from './common';
import styles from './styles.module.scss';
import { ButtonColors, ButtonVarian } from 'common/enums';

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
  tableCell: {
    border: 0,
  },
});

const APPLY_BTN_STYLES = {
  fontSize: '15px',
};
interface Props {
  rows: ITableSortRow[];
  onShare: (id: string) => void;
}

const SortTable = ({ rows, onShare }: Props) => {
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
                className={
                  idx % 2 === 0 ? classes.tableRowEven : classes.tableRowOdd
                }
                key={row.id}
                hover
              >
                <TableCell
                  className={`${classes.tableTitle} ${classes.tableCell}`}
                >
                  {row.title}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {moment(row.lastModified).format('lll')}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <span className={styles.btnWrapper}>
                    <Button
                      onClick={() => onShare(row.id)}
                      variant={ButtonVarian.TEXT}
                      color={ButtonColors.SECONDARY}
                      btnStyles={APPLY_BTN_STYLES}
                      label="Apply to…"
                    />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SortTable;
