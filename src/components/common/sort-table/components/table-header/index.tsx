import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { OrderTypes, HeadCell, TableColNames } from '../../types';

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
  { id: TableColNames.VERSION, label: 'Version' },
  { id: TableColNames.LAST_MODIFIED, label: 'Last Modified' },
];

interface Props {
  titleField: string;
  order: OrderTypes;
  orderBy: string;
  rowCount: number;
  onRequestSort: (property: string) => void;
}

const TableHeader = ({ titleField, order, orderBy, onRequestSort }: Props) => {
  const classes = useStyles();

  const headCells = [
    {
      id: titleField,
      label: 'Title',
    },
    ...defaultHeadCells,
  ];

  return (
    <TableHead>
      <TableRow className={classes.tableHeadRow}>
        {headCells.map(headCell => (
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
