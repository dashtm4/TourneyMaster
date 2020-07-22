import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { LicenseManager } from 'ag-grid-enterprise';
import { HeadingLevelTwo } from 'components/common';

import { getRegistrants } from '../../../registration/registration-edit/logic/actions';
import styles from './styles.module.scss';
import { ColDef } from 'ag-grid-community';

LicenseManager.setLicenseKey(
  'For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-20_September_2020_[v2]_MTYwMDU1NjQwMDAwMA==dae7c5b7e06bcbecbcf9cb824e055293'
);

const columnTypes = {
  numberColumn: {
    width: 130,
    filter: 'agNumberColumnFilter',
  },
  currencyColumn: {
    width: 130,
    filter: 'agNumberColumnFilter',
    valueFormatter: (params: any) => {
      return params.value ? `$${params.value.toFixed(2)}` : '';
    },
  },
  nonEditableColumn: { editable: false },
  dateColumn: {
    filter: 'agDateColumnFilter',
    width: 120,
    valueFormatter: function (params: any) {
      return params.value ? moment(params.value).format('MM/DD/YYYY') : '';
    },
  },
};

const defaultColDef: ColDef = {
  enableValue: true,
  enableRowGroup: true,
  sortable: true,
  resizable: true,
  filter: true,
  editable: true,
};

const initialColumns: ColDef[] = [
  {
    headerName: 'Organization',
    field: 'org_name',
  },
  {
    headerName: 'Event',
    field: 'event_name',
  },
  {
    headerName: 'Start Date',
    field: 'event_startdate',
    type: 'dateColumn',
  },
  {
    headerName: 'Division',
    field: 'division_short_name',
  },
  {
    headerName: 'Team',
    field: 'team_name',
  },
  {
    headerName: 'First Name',
    field: 'participant_first_name',
  },
  {
    headerName: 'Last Name',
    field: 'participant_last_name',
  },
  {
    headerName: 'Amount Due',
    field: 'amount_due',
    type: ['currencyColumn', 'rightAligned'],
  },
  {
    headerName: 'Amount Paid',
    field: 'payment_amount',
    type: ['currencyColumn', 'rightAligned'],
  },
];

interface RegistrantsReportProps {
  registrants: any[];
  getRegistrants: () => void;
}

const RegistrantsReport = ({
  registrants,
  getRegistrants,
}: RegistrantsReportProps) => {
  const [columns, setColumns] = useState([] as any[]);

  useEffect(() => {
    getRegistrants();
    return () => {};
  }, [getRegistrants]);

  useEffect(() => {
    let cols = new Set();
    for (const row of registrants) {
      // TODO: Convert to reduce
      cols = new Set([...cols, ...Object.keys(row)]);
    }

    const columnDefs: any[] = [
      ...initialColumns,
      ...Array.from(cols)
        .filter(fieldName => !initialColumns.find(x => x.field === fieldName))
        .map(fieldName => {
          const col = {
            headerName: fieldName,
            field: fieldName,
          };
          return col;
        }),
    ];

    setColumns(columnDefs);
  }, [registrants]);

  const onFirstDataRendered = (params: any) => {
    const allColumnIds: any[] = [];
    params.columnApi.getAllColumns().forEach(function (column: any) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
  };

  return (
    <div>
      <div className={styles.heading}>
        <HeadingLevelTwo>P/L Management</HeadingLevelTwo>
        <p>Export: Right-Click on the table</p>
      </div>
      <div
        className='ag-theme-alpine'
        style={{
          height: '75vh',
          width: '100%',
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={registrants}
          defaultColDef={defaultColDef}
          columnTypes={columnTypes}
          onFirstDataRendered={onFirstDataRendered}
          sideBar={{
            toolPanels: ['columns', 'filters'],
            defaultToolPanel: 'columns',
          }}
        ></AgGridReact>
      </div>
    </div>
  );
};

interface IState {
  registration: {
    registrants: any;
  };
}

const mapStateToProps = (state: IState) => ({
  registrants: state.registration.registrants,
});

const mapDispatchToProps = {
  getRegistrants,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrantsReport);
