import React from 'react';
import TableHeader from './components/table-header';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { getComparator, stableSort } from './helpers';
import { OrderTypes, TableColNames, Data, HeadCell } from './types';
import styles from './styles.module.scss';

const headCells: HeadCell[] = [
  { id: TableColNames.TITLE, label: 'Title' },
  { id: TableColNames.VERSION, label: 'Version' },
  { id: TableColNames.LAST_MODIFIED, label: 'Last Modified' },
];

interface Props {
  rows: any[];
  titleField: string;
}

const SortTable = ({ rows, titleField }: Props) => {
  const [order, setOrder] = React.useState<OrderTypes>(OrderTypes.ASC);
  const [orderBy, setOrderBy] = React.useState<keyof Data>(TableColNames.TITLE);

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === OrderTypes.ASC;
    setOrder(isAsc ? OrderTypes.DESC : OrderTypes.ASC);
    setOrderBy(property);
  };

  return (
    <div className={styles.tableWrapper}>
      <TableContainer>
        <Table>
          <TableHeader
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(row => (
              <TableRow key={row.title} hover>
                <TableCell>{row[titleField]}</TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.lastModified}</TableCell>
                <TableCell>action</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SortTable;
