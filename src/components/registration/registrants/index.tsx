import * as React from 'react';
import moment from 'moment';
import {
  TableContainer,
  Table,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Collapse,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import RegistrantPayments from './registrant-payments';

export interface IRegistrantsProps {
  registrants: any[];
  onRegistrantClick: any;
  selectedRegistrant: string | null;
  registrantPayments: any[];
}

const Registrants: React.FC<IRegistrantsProps> = (props: IRegistrantsProps) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Participant</TableCell>
            <TableCell>Contact Name</TableCell>
            <TableCell>Contact Phone</TableCell>
            <TableCell>Amount Due</TableCell>
            <TableCell>Amount Paid</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {props.registrants.map(registrant => (
            <React.Fragment key={registrant.reg_response_id}>
              <TableRow
                onClick={props.onRegistrantClick.bind(
                  null,
                  registrant.reg_response_id
                )}
                selected={
                  props.selectedRegistrant === registrant.reg_response_id
                }
                hover={true}
              >
                <TableCell>
                  {moment(registrant.created_datetime).format('MM/DD/YYYY')}
                </TableCell>
                <TableCell>
                  {registrant.coach_first_name
                    ? `${registrant.team_name} (${registrant.team_city}, ${registrant.team_state})`
                    : `${registrant.participant_first_name} ${
                        registrant.participant_last_name
                      } ${
                        registrant.team_name ? `(${registrant.team_name})` : ''
                      }`}
                </TableCell>
                <TableCell>
                  {(registrant.contact_first_name ||
                    registrant.registrant_first_name) +
                    ' ' +
                    (registrant.contact_last_name ||
                      registrant.registrant_last_name)}
                </TableCell>
                <TableCell>
                  {registrant.contact_mobile || registrant.registrant_mobile}
                </TableCell>
                <TableCell>${registrant.amount_due?.toFixed(2)}</TableCell>
                <TableCell>${registrant.payment_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button>
                    <InfoOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7}>
                  <Collapse
                    in={
                      props.selectedRegistrant === registrant.reg_response_id &&
                      props.registrantPayments.length > 0
                    }
                  >
                    <RegistrantPayments payments={props.registrantPayments} />
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
        <TableFooter />
      </Table>
    </TableContainer>
  );
};

export default Registrants;
