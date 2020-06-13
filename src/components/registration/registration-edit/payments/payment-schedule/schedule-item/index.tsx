import * as React from 'react';
import { BindingCbWithTwo, BindingAction } from 'common/models';
import moment from 'moment';
import { TableRow, TableCell } from '@material-ui/core';

import { Input, DatePicker, Button } from 'components/common';
import classes from './index.module.css';

export interface ScheduleItemProps {
  data: any;
  onChange: BindingCbWithTwo<string, string | number | null>;
  onDelete: BindingAction;
}

const ScheduleItem: React.SFC<ScheduleItemProps> = ({
  data,
  onChange,
  onDelete,
}: ScheduleItemProps) => {
  const onDateChange = (e: Date | string) => {
    const mom = moment(e)
      .utcOffset('+05:00')
      .format('YYYY-MM-DD');
    const ret =
      !isNaN(Number(e)) && onChange('date', mom /* new Date(e).toISOString()*/);
    return ret;
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('amount', e.target.value);

  return (
    <TableRow className={classes.ScheduleItem}>
      <TableCell>
        <DatePicker
          fullWidth={true}
          type="date"
          value={
            data?.date
              ? moment(data.date)
                  .utcOffset('+05:00')
                  .format()
              : new Date()
          }
          onChange={onDateChange}
        />
      </TableCell>
      <TableCell>
        <Input
          fullWidth={true}
          startAdornment="%"
          type="number"
          value={data?.amount ? data.amount : ''}
          onChange={onAmountChange}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="outlined"
          color="primary"
          label="Delete"
          onClick={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default ScheduleItem;
