import React from 'react';
import Field from '../field';
import {
  Select,
  Checkbox,
  Button,
  Loader,
  Input,
  FileUpload,
  SectionDropdown,
  HeadingLevelThree,
  CardMessage,
} from '../../../common';
import { Icons } from 'common/constants/icons';
import { FileUploadTypes, AcceptFileTypes } from '../../../common/file-upload';
import {
  IFacility,
  IField,
  IFileMap,
  BindingCbWithOne,
} from '../../../../common/models';
import styles from './styles.module.scss';

enum FormFields {
  FACILITIES_DESCRIPTION = 'facilities_description',
  ADDRESS_ONE = 'address1',
  NUM_FIELDS = 'num_fields',
  RESTROOM = 'restrooms',
  NUM_TOILETS = 'num_toilets',
  RESTROOM_DETAILS = 'restroom_details',
  PARKING_AVAILABLE = 'parking_available',
  PARKING_PROXIMITY = 'parking_proximity',
  GOLF_CARTS_AVAILABE = 'golf_carts_availabe',
  PARKING_DETAILS = 'parking_details',
}

enum ParkingAvailableOptions {
  AMPLE = 'Ample',
  RESTRICTED = 'Restricted',
  VERY_RESTRICTED = 'Very Restricted',
}

interface State {
  isEdit: boolean;
}

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
      <SectionDropdown
        id={facility.facilities_description}
        type="section"
        panelDetailsType="flat"
        isDefaultExpanded={true}
      >
        <HeadingLevelThree>
          <span className={styles.detailsSubtitle}>
            Facility {facilitiyNumber} Details
          </span>
        </HeadingLevelThree>
        <form className={styles.form} autoComplete="off">
          <h3 className={styles.detailsSubtitle}>Location {facilitiyNumber}</h3>
          <div className={styles.descripWrapper}>
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
            <Button
              onClick={this.onEditClick}
              label="Edit"
              variant={isEdit ? 'contained' : 'text'}
              color="secondary"
              type={isEdit ? 'danger' : undefined}
            />
          </div>
          <div className={styles.nameWrapper}>
            <fieldset className={`${styles.filedset} ${styles.filedsetName}`}>
              <legend className={styles.fieldTitle}>
                Facility {facilitiyNumber} Address
              </legend>
              <Input
                onChange={this.onChangeFacility}
                value={facility.address1 || ''}
                name={FormFields.ADDRESS_ONE}
                placeholder={'Facility address'}
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
                options={Array.from(new Array(fields.length + 1), (_, idx) => ({
                  label: `${idx + 1}`,
                  value: `${idx + 1}`,
                }))}
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
              <legend className={styles.fieldTitle}># Portable Toilets</legend>
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
          <fieldset className={`${styles.filedset} ${styles.restroomDetails}`}>
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
                options={Object.keys(ParkingAvailableOptions).map(type => ({
                  label: ParkingAvailableOptions[type],
                  value: ParkingAvailableOptions[type],
                }))}
                width="100%"
                disabled={!isEdit}
              />
            </fieldset>
            <fieldset
              className={`${styles.filedset} ${styles.filedsetDistanceFields}`}
            >
              <legend className={styles.fieldTitle}>
                Distance to Fields (Main Parking)
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
            <fieldset className={`${styles.filedset} ${styles.parkingDetails}`}>
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
              {facility.parking_details && (
                <>
                  <div className={styles.parkingDetailsWrapper}>
                    <Input
                      onChange={this.onChangeFacility}
                      value={facility.parking_details}
                      name={FormFields.PARKING_DETAILS}
                      width="100%"
                      disabled={!isEdit}
                    />
                  </div>
                  <CardMessage type={Icons.EMODJI_OBJECTS}>
                    Notify your attendees they need to know something. For
                    example, if cars will be aggressively ticketed, parking will
                    be tight, etc.
                  </CardMessage>
                </>
              )}
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
      </SectionDropdown>
    );
  }
}

export default FacilityDetails;
