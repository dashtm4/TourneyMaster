import * as React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from '@material-ui/core';
import moment from 'moment';

export interface RegistrantPaymentsProps {
  payments: any[];
}

const RegistrantPayments: React.SFC<RegistrantPaymentsProps> = (
  props: RegistrantPaymentsProps
) => {
  const sum = (fieldName: string) =>
    props.payments.reduce((a, b) => a + b[fieldName], 0).toFixed(2);

  return props.payments.length > 0 ? (
    <React.Fragment>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Due</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Fees</TableCell>
              <TableCell align="right">Tax</TableCell>
              <TableCell align="right">Net</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.payments.map(payment => (
              <TableRow key={payment.reg_payment_id}>
                <TableCell>
                  {moment(payment.payment_date).format('MM/DD/YYYY')}
                </TableCell>
                <TableCell>{payment.payment_status}</TableCell>
                <TableCell align="right">
                  ${payment.amount_due.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ${payment.amount_paid.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ${payment.amount_fees.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ${payment.amount_tax.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ${payment.amount_net.toFixed(2)}
                </TableCell>
                <TableCell>
                  details{/* {payment.payment_details?.slice(0, 20)}*/}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>TOTAL</TableCell>
              <TableCell align="right">${sum('amount_due')}</TableCell>
              <TableCell align="right">${sum('amount_paid')}</TableCell>
              <TableCell align="right">${sum('amount_fees')}</TableCell>
              <TableCell align="right">${sum('amount_tax')}</TableCell>
              <TableCell align="right">${sum('amount_net')}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </React.Fragment>
  ) : null;
};

export default RegistrantPayments;
