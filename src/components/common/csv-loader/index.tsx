/* tslint:disable: jsx-no-lambda */
import React from 'react';
import { connect } from 'react-redux';
import Papa from 'papaparse';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { ITableColumns, IMapping, IField } from 'common/models/table-columns';
import {
  Modal,
  FileUpload,
  Select,
  Button,
  Checkbox,
  Input,
} from 'components/common/';
import { PopupExposure, Toasts } from 'components/common';
import {
  FileUploadTypes,
  AcceptFileTypes,
} from 'components/common/file-upload';
import {
  parseTableDetails,
  getPreview,
  getColumnOptions,
  mapFieldForSaving,
  parseMapping,
  mapDataForSaving,
  checkCsvForValidity,
  getRequiredFields,
} from './helpers';
import {
  getTableColumns,
  saveMapping,
  getMappings,
  removeMapping,
} from './logic/actions';
import CsvTable from './table';
import SaveMapping from './save-mapping';
import ManageMapping from './manage-mapping';
import styles from './styles.module.scss';

interface IComponentsProps {
  isOpen: boolean;
  onClose: BindingAction;
  type: string;
  onCreate: any;
  eventId?: string;
}

interface IMapStateToProps {
  tableColumns: ITableColumns;
  mappings: IMapping[];
}

interface IMapDispatchToProps {
  getTableColumns: BindingCbWithOne<string>;
  saveMapping: BindingCbWithOne<Partial<IMapping>>;
  getMappings: BindingCbWithOne<string>;
  removeMapping: BindingCbWithOne<number>;
}
type Props = IMapStateToProps & IMapDispatchToProps & IComponentsProps;

interface State {
  preview: { header: string[]; row: string[] };
  data: string[][];
  fields: IField[];
  selectedMapping: string;
  isHeaderIncluded: boolean;
  headerPosition: number;
  isConfirmModalOpen: boolean;
  isMappingModalOpen: boolean;
  isManageMappingOpen: boolean;
}

class CsvLoader extends React.Component<Props, State> {
  state: State = {
    preview: { header: [], row: [] },
    data: [],
    fields: [],
    selectedMapping: '',
    isHeaderIncluded: true,
    headerPosition: 1,
    isConfirmModalOpen: false,
    isMappingModalOpen: false,
    isManageMappingOpen: false,
  };

  componentDidMount() {
    this.props.getTableColumns(this.props.type);
    this.props.getMappings(this.props.type);
  }

  componentDidUpdate(prevProps: Props) {
    const { tableColumns } = this.props;

    if (
      (tableColumns && !this.state.fields.length) ||
      tableColumns !== prevProps.tableColumns
    ) {
      const parsedTableDetails = parseTableDetails(tableColumns?.table_details);

      this.setState({
        fields: parsedTableDetails.map((column, index: number) => ({
          value: column.column_name,
          csvPosition: index,
          dataType: column.data_type,
          included: true,
          map_id: column.map_id,
        })),
      });
    }
  }

  onFileSelect = (files: File[]) => {
    const { isHeaderIncluded, headerPosition, fields } = this.state;

    if (isHeaderIncluded && !Number(headerPosition)) {
      return Toasts.errorToast('Please, choose header position');
    }

    if (files[0]) {
      Papa.parse(files[0], {
        skipEmptyLines: true,
        complete: ({ data }) => {
          const isCsvValid = checkCsvForValidity(
            data,
            isHeaderIncluded,
            headerPosition,
            fields
          );
          if (!isCsvValid) {
            return Toasts.errorToast(
              'Please chceck your csv. Something seems to be off with it.'
            );
          } else {
            const preview = getPreview(data, isHeaderIncluded, headerPosition);

            this.setState(prevState => ({
              preview,
              data: isHeaderIncluded ? data.slice(headerPosition) : data,
              fields: preview.header.map((column, index: number) => ({
                value: column,
                csvPosition: index,
                dataType:
                  prevState.fields.find(x => x.value === column)?.dataType ||
                  '',
                included:
                  prevState.fields.find(x => x.value === column)?.included ||
                  prevState.fields.find(x => x.value === column) === undefined,
                map_id:
                  prevState.fields.find(x => x.value === column)?.map_id || '',
              })),
            }));
          }
        },
      });
    }
  };

  onFieldSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { fields } = this.state;

    const parsedColumnsDetails = parseTableDetails(
      this.props.tableColumns?.table_details
    );

    const newField = parsedColumnsDetails.filter(
      field => field.column_name === e.target.value
    )[0];
    const newF = fields.filter(field => field.value === e.target.value)[0];
    const old = fields[index];
    const toChange = fields.indexOf(newF);

    this.setState({
      fields: fields.map((field, idx: number) => {
        if (idx === index) {
          return {
            ...field,
            data_type: newField.data_type,
            value: e.target.value,
            csvPosition: index,
            map_id: newField.map_id,
          };
        } else if (idx === toChange) {
          return {
            ...field,
            data_type: old.dataType,
            value: old.value,
            map_id: old.map_id,
          };
        } else {
          return field;
        }
      }),
    });
  };

  onImport = () => {
    if (!this.state.data.length) {
      return Toasts.errorToast('Please, upload a csv file first');
    }
    const { type, eventId, onCreate } = this.props;

    const dataToSave: any = [];
    this.state.data.forEach(res => {
      const event = mapDataForSaving(type, res, this.state.fields, eventId);
      dataToSave.push(event);
    });

    onCreate(dataToSave, this.onModalClose);
    this.setState({ isConfirmModalOpen: false });
  };

  onFieldIncludeChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    this.setState({
      fields: this.state.fields.map((field, idx: number) =>
        idx === index ? { ...field, included: !field.included } : field
      ),
    });
  };

  onIsHeaderIncludedChange = () => {
    this.setState({ isHeaderIncluded: !this.state.isHeaderIncluded });
  };

  onHeaderPositionChange = (e: React.ChangeEvent<any>) => {
    this.setState({ headerPosition: e.target.value });
  };

  onMappingSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      tableColumns: { table_details },
    } = this.props;
    const mapping = parseMapping(e.target.value, table_details);

    this.setState({ fields: mapping, selectedMapping: e.target.value });
  };

  onModalClose = () => {
    this.props.onClose();
    this.setState({
      preview: { header: [], row: [] },
      data: [],
      fields: [],
      selectedMapping: '',
      headerPosition: 1,
    });
  };

  onCancelClick = () => {
    if (this.state.data.length) {
      this.setState({ isConfirmModalOpen: true });
    } else {
      this.onCancel();
    }
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
    const data = {
      import_description: name,
      map_id_json: JSON.stringify(mapFieldForSaving(this.state.fields)),
      destination_table: this.props.type,
    };

    this.props.saveMapping(data);
    this.setState({ isMappingModalOpen: false });
  };

  onSaveMappingClick = () => {
    this.setState({ isMappingModalOpen: true });
  };

  onMappingModalClose = () => {
    this.setState({ isMappingModalOpen: false });
  };

  onManageMappingClick = () => {
    this.setState({ isManageMappingOpen: true });
  };

  onManageMappingModalClose = () => {
    this.setState({ isManageMappingOpen: false });
  };

  onIncludeAllChange = () => {
    const areAllFieldsSelected = this.state.fields.every(
      field => field.included
    );
    this.setState({
      fields: this.state.fields.map(field => ({
        ...field,
        included: !areAllFieldsSelected,
      })),
    });
  };

  render() {
    const { isOpen, mappings, removeMapping, tableColumns, type } = this.props;
    const {
      data: { length },
      fields,
      headerPosition,
      isConfirmModalOpen,
      isHeaderIncluded,
      isManageMappingOpen,
      isMappingModalOpen,
      preview,
      selectedMapping,
    } = this.state;
    const columnOptions =
      tableColumns && getColumnOptions(tableColumns?.table_details);

    const mappingsOptions = mappings.map(map => ({
      label: map.import_description,
      value: map.map_id_json,
    }));

    const requiredFields = tableColumns
      ? getRequiredFields(type, tableColumns?.table_details)
      : [];

    return (
      <Modal isOpen={isOpen} onClose={this.onModalClose}>
        <div className={styles.container}>
          <div className={styles.uploaderWrapper}>
            <div>
              <FileUpload
                type={FileUploadTypes.BUTTON}
                acceptTypes={[AcceptFileTypes.CSV]}
                onUpload={this.onFileSelect}
                btnLabel={'Select CSV File'}
                withoutRemoveBtn={true}
              />
            </div>
            <Button
              label="Manage"
              color="secondary"
              variant="text"
              onClick={this.onManageMappingClick}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.checkboxWrapper}>
              <Checkbox
                options={[
                  {
                    label: 'Header is included on row #',
                    checked: isHeaderIncluded,
                  },
                ]}
                onChange={this.onIsHeaderIncludedChange}
              />
              <Input
                width={'50px'}
                minWidth={'50px'}
                label=""
                value={headerPosition}
                onChange={this.onHeaderPositionChange}
                type="number"
                disabled={!isHeaderIncluded}
              />
            </div>
            <Select
              width={'200px'}
              options={mappingsOptions || []}
              label="Select Historical Mapping"
              value={selectedMapping}
              onChange={this.onMappingSelect}
              disabled={!length}
            />
          </div>
          <CsvTable
            preview={preview}
            fields={fields}
            onFieldIncludeChange={this.onFieldIncludeChange}
            onSelect={this.onFieldSelect}
            columnOptions={columnOptions}
            onIncludeAllChange={this.onIncludeAllChange}
          />
          <div className={styles.requiredFieldWrapper}>
            <span className={styles.title}>Required Fields:</span>{' '}
            {requiredFields.map((field, index) =>
              index !== requiredFields.length - 1
                ? `"${field}", `
                : `"${field}"`
            )}
          </div>

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
            isOpen={isConfirmModalOpen}
            onClose={this.onConfirmModalClose}
            onExitClick={this.onCancel}
            onSaveClick={this.onImport}
          />
          <SaveMapping
            isOpen={isMappingModalOpen}
            onClose={this.onMappingModalClose}
            onCancel={this.onSaveMappingCancel}
            onSave={this.onMappingSave}
          />
          <ManageMapping
            isOpen={isManageMappingOpen}
            onClose={this.onManageMappingModalClose}
            mappings={mappings}
            onMappingDelete={removeMapping}
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
  mappings: state.tableColumns.mappings,
  tableColumns: state.tableColumns.data,
});

const mapDispatchToProps = {
  getMappings,
  getTableColumns,
  removeMapping,
  saveMapping,
};

export default connect(mapStateToProps, mapDispatchToProps)(CsvLoader);
