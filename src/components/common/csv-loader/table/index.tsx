/* tslint:disable: jsx-no-lambda */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import styles from '../styles.module.scss';
import { Select, Checkbox } from 'components/common/';
import { IField } from '../index';
import { BindingCbWithTwo } from 'common/models';

interface IProps {
  preview: { headers: string[]; row: string[] };
  fields: IField[];
  onCheckboxChange: BindingCbWithTwo<
    React.ChangeEvent<HTMLInputElement>,
    number
  >;
  onSelect: BindingCbWithTwo<React.ChangeEvent<HTMLInputElement>, number>;
  columnOptions: { label: string; value: string }[];
}

const CsvTable = ({
  preview,
  fields,
  onCheckboxChange,
  onSelect,
  columnOptions,
}: IProps) => {
  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table stickyHeader={true} aria-label="simple table" padding="none">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">
              <b>Data Header</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <b>Include</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <b>Maps To</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <b>Mapping Data type</b>
            </TableCell>
            <TableCell component="th" scope="row">
              <b>Data Example</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preview.headers.map((col, index: number) => (
            <TableRow
              key={index}
              style={{
                backgroundColor: !fields[index].included
                  ? '#DCDCDC'
                  : 'transparent',
              }}
            >
              <TableCell component="td" scope="row">
                {col}
              </TableCell>
              <TableCell component="td" scope="row">
                <div className={styles.checkboxWrapper}>
                  <Checkbox
                    options={[
                      {
                        label: '',
                        checked: fields[index].included,
                      },
                    ]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onCheckboxChange(e, index);
                    }}
                  />
                </div>
              </TableCell>
              <TableCell component="td" scope="row">
                <div className={styles.selectWrapper}>
                  <Select
                    options={columnOptions || []}
                    label=""
                    value={fields[index]?.value || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onSelect(e, index);
                    }}
                    disabled={!fields[index].included}
                  />
                </div>
              </TableCell>
              <TableCell component="td" scope="row">
                {fields[index]?.data_type}
              </TableCell>
              <TableCell component="td" scope="row">
                {preview.row[index]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CsvTable;
