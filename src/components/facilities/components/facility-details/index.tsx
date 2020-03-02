import React from 'react';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapped,
} from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Field from '../field';
import {
  Select,
  Checkbox,
  Button,
  Loader,
  Input,
  FileUpload,
} from '../../../common';
import { FileUploadTypes, AcceptFileTypes } from '../../../common/file-upload';
import { stringToLink } from 'helpers';
import {
  IFacility,
  IField,
  IFileMap,
  BindingCbWithOne,
} from '../../../../common/models';
import styles from './styles.module.scss';

interface Props {
  facility: IFacility;
  fields: IField[];
  facilitiyNumber: number;
  loadFields: (facilityId: string) => void;
  addEmptyField: (facilityId: string) => void;
  updateField: BindingCbWithOne<IField>;
  updateFacilities: BindingCbWithOne<IFacility>;
  uploadFileMap: (files: IFileMap[]) => void;
}

interface State {
  isEdit: boolean;
}

enum FormFields {
  FACILITIES_DESCRIPTION = 'facilities_description',
  NUM_FIELDS = 'num_fields',
  RESTROOM = 'restrooms',
  NUM_TOILETS = 'num_toilets',
  RESTROOM_DETAILS = 'restroom_details',
  PARKING_AVAILABLE = 'parking_available',
  PARKING_PROXIMITY = 'parking_proximity',
  GOLF_CARTS_AVAILABE = 'golf_carts_availabe',
  PARKING_DETAILS = 'parking_details',
}

class FacilityDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEdit: Boolean(props.facility.isNew),
    };
  }

  onChangeFacility = ({ target: { name, value } }: any) => {
    const { facility, updateFacilities } = this.props;

    updateFacilities({ ...facility, [name]: value });
  };

  onChangeField = (
    field: IField,
    {
      target: { name, type, value, checked },
    }: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { updateField } = this.props;

    updateField({ ...field, [name]: type === 'checkbox' ? +checked : value });
  };

  onEditClick = () => this.setState(({ isEdit }) => ({ isEdit: !isEdit }));

  onMapFileUpload = (files: File[]) => {
    const { uploadFileMap } = this.props;

    uploadFileMap(
      files?.map((file: File) => ({ file, destinationType: 'facility_map' }))
    );
  };

  render() {
    const {
      facility,
      fields,
      facilitiyNumber,
      loadFields,
      addEmptyField,
    } = this.props;
    const { isEdit } = this.state;

    if (
      !facility.isNew &&
      !facility.isFieldsLoading &&
      !facility.isFieldsLoaded
    ) {
      loadFields(facility.facilities_id);
    }

    return (
      <ExpansionPanelWrapped
        id={
          facility.facilities_description
            ? stringToLink(facility.facilities_description)
            : ''
        }
        defaultExpanded
      >
        <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
          <h2 className={styles.detailsSubtitle}>
            Facility {facilitiyNumber} Details
          </h2>
        </ExpansionPanelSummaryWrapped>
        <ExpansionPanelDetailsWrapped>
          <form className={styles.form} autoComplete="off">
            <h3 className={styles.detailsSubtitle}>
              Location {facilitiyNumber}
            </h3>
            <p className={styles.descripWrapper}>
              <span>The Proving Grounds</span>
              <Button
                onClick={this.onEditClick}
                label="Edit"
                variant={isEdit ? 'contained' : 'text'}
                color="secondary"
                type={isEdit ? 'danger' : undefined}
              />
            </p>
            <div className={styles.nameWrapper}>
              <fieldset className={`${styles.filedset} ${styles.filedsetName}`}>
                <legend className={styles.fieldTitle}>
                  Facility {facilitiyNumber} Name
                </legend>
                <Input
                  onChange={this.onChangeFacility}
                  value={facility.facilities_description || ''}
                  name={FormFields.FACILITIES_DESCRIPTION}
                  placeholder={'Main Stadium'}
                  disabled={!isEdit}
                  width={'100%'}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    if (evt.target.value > fields.length.toString()) {
                      this.onChangeFacility(evt);
                      addEmptyField(facility.facilities_id);
                    }
                  }}
                  value={`${fields.length || ''}`}
                  name={FormFields.NUM_FIELDS}
                  options={Array.from(
                    new Array(fields.length + 1),
                    (_, idx) => ({
                      label: `${idx + 1}`,
                      value: `${idx + 1}`,
                    })
                  )}
                  width="160px"
                  disabled={!isEdit}
                />
              </fieldset>
            </div>
            <ul className={styles.fieldList}>
              {facility.isFieldsLoading ? (
                <Loader />
              ) : (
                fields.map((it, idx) => (
                  <li key={it.field_id}>
                    <Field
                      field={it}
                      fieldNumber={idx + 1}
                      isEdit={isEdit}
                      onChange={this.onChangeField}
                    />
                  </li>
                ))
              )}
            </ul>
            <div className={styles.restroomWrapper}>
              <fieldset
                className={`${styles.filedset} ${styles.filedsetRestrooms}`}
              >
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={facility.restrooms || ''}
                  name="restrooms"
                  options={['In Facility', 'Portable'].map(type => ({
                    label: type,
                    value: type,
                  }))}
                  width="100%"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <Input
                  onChange={this.onChangeFacility}
                  value={facility.num_toilets ? `${facility.num_toilets}` : ''}
                  name={FormFields.NUM_TOILETS}
                  placeholder="5"
                  width="250px"
                  disabled={!isEdit}
                />
              </fieldset>
            </div>
            <fieldset
              className={`${styles.filedset} ${styles.restroomDetails}`}
            >
              <Checkbox
                onChange={() =>
                  this.onChangeFacility({
                    target: {
                      name: FormFields.RESTROOM_DETAILS,
                      value: facility.restroom_details || ' ',
                    },
                  })
                }
                options={[
                  {
                    label: 'Restroom Details',
                    checked: Boolean(facility.restroom_details),
                    disabled: !isEdit,
                  },
                ]}
              />
              {facility.restroom_details && (
                <Input
                  onChange={this.onChangeFacility}
                  value={facility.restroom_details}
                  name={FormFields.RESTROOM_DETAILS}
                  width="100%"
                  disabled={!isEdit}
                />
              )}
            </fieldset>
            <div className={styles.parkingWrapper}>
              <fieldset
                className={`${styles.filedset} ${styles.filedsetParkingAvailable}`}
              >
                <legend className={styles.fieldTitle}>Parking Available</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={facility.parking_available || ''}
                  name="parking_available"
                  options={['Ample', 'AmAmple', 'AmAmAmple'].map(type => ({
                    label: type,
                    value: type,
                  }))}
                  width="100%"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset
                className={`${styles.filedset} ${styles.filedsetDistanceFields}`}
              >
                <legend className={styles.fieldTitle}>
                  Distance to Fields
                </legend>
                <Input
                  onChange={this.onChangeFacility}
                  value={
                    facility.parking_proximity
                      ? `${facility.parking_proximity}`
                      : ''
                  }
                  name={FormFields.PARKING_PROXIMITY}
                  placeholder="Meters"
                  width="100%"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={`${styles.filedset} ${styles.filedsetGolf}`}>
                <legend className="visually-hidden">Golf Carts </legend>
                <Checkbox
                  onChange={() =>
                    this.onChangeFacility({
                      target: {
                        name: FormFields.GOLF_CARTS_AVAILABE,
                        value: facility.golf_carts_availabe ? null : true,
                      },
                    })
                  }
                  options={[
                    {
                      label: 'Golf Carts Available',
                      checked: Boolean(facility.golf_carts_availabe),
                      disabled: !isEdit,
                    },
                  ]}
                />
              </fieldset>
            </div>
            <fieldset className={`${styles.filedset} ${styles.parkingDetails}`}>
              <Checkbox
                onChange={() =>
                  this.onChangeFacility({
                    target: {
                      name: FormFields.PARKING_DETAILS,
                      value: facility.parking_details || ' ',
                    },
                  })
                }
                options={[
                  {
                    label: 'Parking Details',
                    checked: Boolean(facility.parking_details),
                    disabled: !isEdit,
                  },
                ]}
              />
              {facility.parking_details && (
                <Input
                  onChange={this.onChangeFacility}
                  value={facility.parking_details}
                  name={FormFields.PARKING_DETAILS}
                  width="100%"
                  disabled={!isEdit}
                />
              )}
            </fieldset>
            <FileUpload
              type={FileUploadTypes.BUTTON}
              acceptTypes={[AcceptFileTypes.PDF]}
              onUpload={this.onMapFileUpload}
            />
          </form>
        </ExpansionPanelDetailsWrapped>
      </ExpansionPanelWrapped>
    );
  }
}

export default FacilityDetails;
