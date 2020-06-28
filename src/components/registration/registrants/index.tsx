import * as React from 'react';
import { connect } from 'react-redux';
import MaterialTable, { Column } from 'material-table';
import RegistrantPayments from './registrant-payments';
import { formatPhoneNumber } from '../../../helpers/formatPhoneNumber';
import moment from 'moment';
import { IDivision } from 'common/models';

export interface IRegistrantsProps {
  registrants: any[];
  divisions: IDivision[];
}

const Registrants: React.FC<IRegistrantsProps> = (props: IRegistrantsProps) => {
  const divisions = props.divisions.reduce((map, division) => {
    map[division.division_id] = division.short_name;
    return map;
  }, {});

  let columns: Column<any>[] = [
    {
      title: 'Date',
      field: 'date',
      type: 'date',
    },
    {
      title: 'Participant',
      field: 'participant',
      type: 'string',
    },
    { title: 'Team', field: 'team_name', type: 'string', hidden: true },
    {
      title: 'Division',
      field: 'division_id',
      type: 'string',
      lookup: divisions,
    },

    { title: 'Contact', field: 'contact_name', type: 'string' },
    {
      title: 'Phone',
      field: 'contact_phone',
      type: 'string',
      cellStyle: { minWidth: 90 },
    },
    {
      title: 'Due',
      field: 'amount_due',
      type: 'currency',
      cellStyle: { maxWidth: 40 },
      headerStyle: { maxWidth: 40 },
    },
    {
      title: 'Paid',
      field: 'amount_paid',
      type: 'currency',
      cellStyle: { maxWidth: 40 },
      headerStyle: { maxWidth: 40 },
    },
  ];

  columns = columns.map(column => ({
    ...column,
    cellStyle: { ...column.cellStyle, padding: '0.1em 0.3em', fontSize: 14 },
  }));

  const detailPanel = (rowData: any) => {
    return <RegistrantPayments reg_response_id={rowData.reg_response_id} />;
  };

  const data: any[] = props.registrants.map(registrant => ({
    reg_response_id: registrant.reg_response_id,
    date: moment(registrant.created_datetime).format('MM/DD/YYYY'),
    participant: registrant.team_name
      ? `${registrant.team_name}`
      : `${registrant.participant_first_name} ${registrant.participant_last_name}`,
    team_name: registrant.team_name,
    division_id: registrant.division_id,
    contact_name:
      (registrant.contact_first_name || registrant.registrant_first_name) +
      ' ' +
      (registrant.contact_last_name || registrant.registrant_last_name),
    contact_phone: formatPhoneNumber(
      registrant.contact_mobile || registrant.registrant_mobile
    ),
    amount_due: registrant.amount_due?.toFixed(2),
    amount_paid: registrant.payment_amount.toFixed(2),
  }));
  return (
    <div style={{ minWidth: '100%' }}>
      <MaterialTable
        columns={columns}
        data={data}
        title="All Participants"
        detailPanel={detailPanel}
        options={{
          pageSize: 10,
          padding: 'dense',
          exportButton: true,
          exportAllData: true,
          columnsButton: true,
          filtering: true,
          showTitle: false,
          thirdSortClick: false,
        }}
        onRowClick={(_, __, togglePanel) => {
          togglePanel!();
        }}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  divisions: state.registration.divisions,
  registrants: state.registration.registrants,
});

export default connect(mapStateToProps)(Registrants);
