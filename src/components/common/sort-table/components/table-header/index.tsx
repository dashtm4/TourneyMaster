import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { OrderTypes, HeadCell, TableSortRowTypes } from '../../common';

const useStyles = makeStyles({
  tableHeadRow: {
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    fontWeight: 700,
    color: '#6a6a6a',
  },
});

const defaultHeadCells: HeadCell[] = [
  { id: TableSortRowTypes.TITLE, label: 'Title' },
  { id: TableSortRowTypes.VERSION, label: 'Version' },
  { id: TableSortRowTypes.LAST_MODIFIED, label: 'Last Modified' },
];

interface Props {
  order: OrderTypes;
  orderBy: string;
  rowCount: number;
  onRequestSort: (property: TableSortRowTypes) => void;
}

const TableHeader = ({ order, orderBy, onRequestSort }: Props) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow className={classes.tableHeadRow}>
        {defaultHeadCells.map(headCell => (
          <TableCell key={headCell.id}>
            <TableSortLabel
              className={classes.tableHeader}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : OrderTypes.ASC}
              onClick={() => onRequestSort(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
