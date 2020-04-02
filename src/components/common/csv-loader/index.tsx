/* tslint:disable: jsx-no-lambda */
import React from 'react';
import {
  Modal,
  FileUpload,
  Select,
  Button,
  Checkbox,
  Input,
} from 'components/common/';
import {
  FileUploadTypes,
  AcceptFileTypes,
} from 'components/common/file-upload';
import Papa from 'papaparse';
import { connect } from 'react-redux';
import { getTableColumns, saveMapping, getMapping } from './logic/actions';
import styles from './styles.module.scss';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { createEvent } from 'components/event-details/logic/actions';
import {
  parseTableDetails,
  getPreviewFromResults,
  getColumnOptions,
  mapFieldForSaving,
  parseMapping,
  mapDataForSaving,
  checkCsvForValidity,
} from './helpers';
import { Toasts } from 'components/common';
import { PopupExposure } from 'components/common';
import CsvTable from './table';
import SaveMapping from './save-mapping';

export interface ITableColumns {
  map_id: number;
  table_name: string;
  is_active_YN: number;
  created_by: string;
  table_details: string;
}

export interface IColumnDetails {
  ordinal_position: string;
  column_name: string;
  column_display: string;
  data_type: string;
  is_nullable: string;
  map_id: string;
}

interface ComponentsProps {
  isOpen: boolean;
  onClose: BindingAction;
  type: string;
  onCreate: any;
  eventId?: string;
}

interface IMapStateToProps {
  tableColumns: ITableColumns;
  mappings: any[];
}

interface IMapDispatchToProps {
  getTableColumns: BindingCbWithOne<string>;
  saveMapping: BindingCbWithOne<any>;
  getMapping: BindingCbWithOne<string>;
  createEvent: BindingCbWithOne<Partial<EventDetailsDTO>>;
}
type Props = IMapStateToProps & IMapDispatchToProps & ComponentsProps;

export interface IField {
  value: string;
  csv_position: number;
  data_type: string;
  included: boolean;
  map_id: string;
}

interface State {
  preview: { headers: string[]; row: string[] };
  results: string[][];
  fields: IField[];
  headerIncluded: boolean;
  headerPosition: number;
  isConfirmModalOpen: boolean;
  isMappingModalOpen: boolean;
}

class CsvLoader extends React.Component<Props, State> {
  state: State = {
    preview: { headers: [], row: [] },
    results: [],
    fields: [],
    headerIncluded: true,
    headerPosition: 1,
    isConfirmModalOpen: false,
    isMappingModalOpen: false,
  };

  componentDidMount() {
    this.props.getTableColumns(this.props.type);
    this.props.getMapping(this.props.type);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (this.props.tableColumns && !this.state.fields.length) ||
      this.props.tableColumns !== prevProps.tableColumns
    ) {
      const parsedColumnsDetails = parseTableDetails(
        this.props.tableColumns?.table_details
      );
      this.setState({
        fields: parsedColumnsDetails.map((column, index: number) => ({
          value: column.column_name,
          csv_position: index,
          data_type: column.data_type,
          included: true,
          map_id: column.map_id,
        })),
      });
    }
  }

  onFileUpload = (files: File[]) => {
    if (this.state.headerIncluded && !this.state.headerPosition) {
      return Toasts.errorToast('Please, choose header position');
    }
    if (files[0]) {
      Papa.parse(files[0], {
        complete: results => {
          if (
            checkCsvForValidity(
              results.data,
              this.state.headerIncluded,
              this.state.headerPosition,
              this.state.fields
            )
          ) {
            return Toasts.errorToast(
              'Please, upload valid csv or check header position'
            );
          } else {
            const preview = getPreviewFromResults(
              results.data,
              this.state.headerIncluded,
              this.state.headerPosition
            );
            this.setState({
              preview,
              results: this.state.headerIncluded
                ? results.data.slice(this.state.headerPosition)
                : results.data,
            });
          }
        },
      });
    }
  };

  onSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { fields } = this.state;

    const newField = fields.filter(field => field.value === e.target.value)[0];
    const old = fields[index];
    const toChange = fields.indexOf(newField);

    this.setState({
      fields: fields.map((field, idx: number) => {
        if (idx === index) {
          return {
            ...field,
            data_type: newField.data_type,
            value: e.target.value,
            csv_position: index,
          };
        } else if (idx === toChange) {
          return { ...field, data_type: old.data_type, value: old.value };
        } else {
          return field;
        }
      }),
    });
  };

  onCheckboxChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    this.setState({
      fields: this.state.fields.map((field, idx: number) =>
        idx === index ? { ...field, included: !field.included } : field
      ),
    });
  };

  onImport = () => {
    if (!this.state.results.length) {
      return Toasts.errorToast('Please, upload a csv file first');
    }
    const events: Partial<EventDetailsDTO>[] = [];
    this.state.results.forEach(res => {
      const event = mapDataForSaving(
        this.props.type,
        res,
        this.state.fields,
        this.props.eventId
      );
      events.push(event);
    });

    if (this.props.type === 'event_master') {
      events.forEach(event => {
        this.props.onCreate(event);
      });
    } else if (this.props.type === 'facilities') {
      this.props.onCreate(events, []);
    } else {
      this.props.onCreate(events, this.props.eventId);
      this.onModalClose();
    }
  };

  onHeaderIncludedChange = () => {
    this.setState({ headerIncluded: !this.state.headerIncluded });
  };

  onHeaderPositionChange = (e: any) => {
    this.setState({ headerPosition: e.target.value });
  };

  onMappingSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(parseMapping(this.state.fields, e.target.value));
  };

  onModalClose = () => {
    this.props.onClose();
    this.setState({
      preview: { headers: [], row: [] },
      results: [],
      fields: [],
      headerPosition: 1,
    });
  };

  onCancelClick = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  onConfirmModalClose = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  onCancel = () => {
    this.onModalClose();
    this.setState({ isConfirmModalOpen: false });
  };

  onSaveMappingCancel = () => {
    this.setState({ isMappingModalOpen: false });
  };

  onMappingSave = (name: string) => {
    const mappedFields = mapFieldForSaving(this.state.fields);
    // console.log(mappedFields);
    this.props.saveMapping({
      name,
      mappedFields,
      destination_table: this.props.type,
    });
    this.setState({ isMappingModalOpen: false });
  };

  onSaveMappingClick = () => {
    this.setState({ isMappingModalOpen: true });
  };

  onMappingModalClose = () => {
    this.setState({ isMappingModalOpen: false });
  };

  render() {
    const columnOptions =
      this.props.tableColumns &&
      getColumnOptions(this.props.tableColumns?.table_details);

    const mappingsOptions =
      this.props.mappings &&
      this.props.mappings.map(map => ({
        label: map.import_description,
        value: map.map_id_json,
      }));

    return (
      <Modal isOpen={this.props.isOpen} onClose={this.onModalClose}>
        <div className={styles.container}>
          <div className={styles.uploaderWrapper}>
            <div>
              <FileUpload
                type={FileUploadTypes.BUTTON}
                acceptTypes={[AcceptFileTypes.CSV]}
                onUpload={this.onFileUpload}
                btnLabel={'Upload CSV File'}
                withoutRemoveBtn={true}
              />
            </div>
          </div>
          <div className={styles.checkboxWrapper}>
            <div style={{ display: 'flex' }}>
              <Checkbox
                options={[
                  {
                    label: 'Header is included on row #',
                    checked: this.state.headerIncluded,
                  },
                ]}
                onChange={this.onHeaderIncludedChange}
              />
              <Input
                width={'50px'}
                minWidth={'50px'}
                label=""
                value={this.state.headerPosition}
                onChange={this.onHeaderPositionChange}
                type="number"
                disabled={!this.state.headerIncluded}
              />
            </div>
            <Select
              width={'200px'}
              options={mappingsOptions || []}
              label="Select Mapping"
              value={''}
              onChange={this.onMappingSelect}
            />
          </div>
          <CsvTable
            preview={this.state.preview}
            fields={this.state.fields}
            onCheckboxChange={this.onCheckboxChange}
            onSelect={this.onSelect}
            columnOptions={columnOptions}
          />
          <div className={styles.btnsWrapper}>
            <Button
              label="Cancel"
              color="secondary"
              variant="text"
              onClick={this.onCancelClick}
            />
            <Button
              label="Save Mapping"
              color="secondary"
              variant="text"
              onClick={this.onSaveMappingClick}
            />
            <Button
              label="Import"
              color="primary"
              variant="contained"
              onClick={this.onImport}
            />
          </div>
          <PopupExposure
            isOpen={this.state.isConfirmModalOpen}
            onClose={this.onConfirmModalClose}
            onExitClick={this.onCancel}
            onSaveClick={this.onImport}
          />
          <SaveMapping
            isOpen={this.state.isMappingModalOpen}
            onClose={this.onMappingModalClose}
            onCancel={this.onSaveMappingCancel}
            onSave={this.onMappingSave}
          />
        </div>
      </Modal>
    );
  }
}

interface IState {
  tableColumns: { data: ITableColumns; mappings: any[] };
}

const mapStateToProps = (state: IState) => ({
  tableColumns: state.tableColumns.data,
  mappings: state.tableColumns.mappings,
});

const mapDispatchToProps = {
  getTableColumns,
  createEvent,
  saveMapping,
  getMapping,
};

export default connect(mapStateToProps, mapDispatchToProps)(CsvLoader);
