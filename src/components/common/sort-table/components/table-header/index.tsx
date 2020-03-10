import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { OrderTypes, Data, HeadCell } from '../../types';

interface Props {
  headCells: HeadCell[];
  order: OrderTypes;
  orderBy: string;
  rowCount: number;
  onRequestSort: (property: keyof Data) => void;
}

const TableHeader = ({ headCells, order, orderBy, onRequestSort }: Props) => (
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

export default TableHeader;
