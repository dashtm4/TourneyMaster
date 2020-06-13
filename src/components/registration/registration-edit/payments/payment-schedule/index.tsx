import * as React from 'react';
import { BindingCbWithOne } from 'common/models';
import ScheduleItem from './schedule-item';
import classes from './index.module.css';
import {
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Button } from 'components/common';

export interface PaymentScheduleProps {
  schedule: any;
  onScheduleChange: BindingCbWithOne<any>;
}

const PaymentSchedule: React.SFC<PaymentScheduleProps> = ({
  schedule,
  onScheduleChange,
}: PaymentScheduleProps) => {
  const onPhaseChange = (indexToUpdate: number, field: string, value: any) => {
    const newSchedule = {
      ...schedule,
      schedule: schedule.schedule.map((phase: any, index: number) => {
        let t =
          index === indexToUpdate ? { ...phase, [field]: value } : { ...phase };
        return t;
      }),
    };
    onScheduleChange(newSchedule);
  };

  const onPhaseDelete = (indexToDelete: number) => {
    const newSchedule = {
      ...schedule,
      schedule: schedule.schedule.filter(
        (_phase: any, index: number) => index !== indexToDelete
      ),
    };
    onScheduleChange(newSchedule);
  };

  const onPhaseAdd = () => {
    const newSchedule = {
      ...schedule,
      schedule: schedule.schedule.concat([
        { date: new Date(), amountType: 'percent', amount: '0' },
      ]),
    };
    onScheduleChange(newSchedule);
  };

  return (
    <React.Fragment>
      <TableContainer className={classes.PaymentSchedule}>
        <Table size="small">
          <TableHead>
            <TableCell>Payment Date</TableCell>
            <TableCell>Amount (%)</TableCell>
            <TableCell />
          </TableHead>
          {schedule?.schedule?.map((phase: any, index: number) => (
            <ScheduleItem
              key={index}
              data={phase}
              onChange={onPhaseChange.bind(null, index)}
              onDelete={onPhaseDelete.bind(null, index)}
            />
          ))}
          <TableRow>
            <TableCell colSpan={1}>
              <Button
                variant="outlined"
                color="primary"
                label="Add Payment Date"
                onClick={onPhaseAdd}
              />
            </TableCell>
            <TableCell>
              Total:{' '}
              {schedule?.schedule?.reduce(
                (sum: number, phase: any) => sum + Number(phase.amount),
                0
              )}
              %
            </TableCell>
            <TableCell />
          </TableRow>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};

export default PaymentSchedule;
