import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { OrderTypes, HeadCell, TableColNames } from '../../types';

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
  const headCells = [
    {
      id: titleField,
      label: 'Title',
    },
    ...defaultHeadCells,
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id}>
            <TableSortLabel
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
