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
  DatePicker,
} from 'components/common';
import { FileUploadTypes, AcceptFileTypes } from '../../../common/file-upload';
import PlacesAutocompleteInput from '../../../event-details/primary-information/map/autocomplete';
import Map from '../../../event-details/primary-information/map';
import { timeToDate, dateToTime } from 'helpers';
import {
  IFacility,
  IField,
  IUploadFile,
  BindingCbWithOne,
} from 'common/models';
import { Icons } from 'common/enums/icons';
import styles from './styles.module.scss';

enum FormFields {
  FACILITIES_DESCRIPTION = 'facilities_description',
  ADDRESS_ONE = 'address1',
  NUM_FIELDS = 'num_fields',
  RESTROOM = 'restrooms',
  NUM_TOILETS = 'num_toilets',
  RESTROOM_DETAILS = 'restroom_details',
  FIRST_GAME_TIME = 'first_game_time',
  LAST_GAME_END = 'last_game_end',
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

const FACILITY_FIELD_MAP_KEY = 'field_map_URL';

interface State {
  isEdit: boolean;
  isRestRoomDetails: boolean;
  isParkingDetails: boolean;
}

interface Props {
  facility: IFacility;
  fields: IField[];
  facilitiyNumber: number;
  loadFields: (facilityId: string) => void;
  addEmptyField: (facilityId: string) => void;
  updateField: BindingCbWithOne<IField>;
  updateFacilities: BindingCbWithOne<IFacility>;
  uploadFileMap: (facility: IFacility, files: IUploadFile[]) => void;
  expanded: boolean;
  onToggleOne: BindingCbWithOne<number>;
  index: number;
}

class FacilityDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEdit: Boolean(props.facility.isNew),
      isRestRoomDetails: Boolean(props.facility.restroom_details),
      isParkingDetails: Boolean(props.facility.parking_details),
    };
  }

  onChangeFacility = (name: FormFields, value: string | number) => {
    const { facility, updateFacilities } = this.props;

    updateFacilities({ ...facility, [name]: value });
  };

  onAdressSelect = (position: any) => {
    const { facility, updateFacilities } = this.props;
    updateFacilities({
      ...facility,
      facility_lat: position.lat,
      facility_long: position.lng,
    });
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
    const { facility, uploadFileMap } = this.props;

    uploadFileMap(
      facility,
      files.map((file: File) => ({
        file,
        destinationType: FACILITY_FIELD_MAP_KEY,
      }))
    );
  };

  onSectionToggle = () => {
    this.props.onToggleOne(this.props.index);
  };

  render() {
    const {
      facility,
      fields,
      facilitiyNumber,
      loadFields,
      addEmptyField,
    } = this.props;
    const { isEdit, isRestRoomDetails, isParkingDetails } = this.state;

    console.log(facility);

    if (
      !facility.isNew &&
      !facility.isFieldsLoading &&
      !facility.isFieldsLoaded
    ) {
      loadFields(facility.facilities_id);
    }
    const { facility_lat: lat, facility_long: lng } = this.props.facility;

    return (
      <SectionDropdown
        isDefaultExpanded={true}
        id={facility.facilities_description}
        type="section"
        panelDetailsType="flat"
        expanded={this.props.expanded !== undefined && this.props.expanded}
        onToggle={this.onSectionToggle}
      >
        <HeadingLevelThree>
          <span className={styles.detailsSubtitle}>
            Facility {facilitiyNumber} Details
          </span>
        </HeadingLevelThree>
        <form className={styles.form} autoComplete="off">
          <div className={styles.container}>
            <div className={styles.section}>
              <h3 className={styles.detailsSubtitle}>
                Location {facilitiyNumber}
              </h3>
              <fieldset className={`${styles.filedset} ${styles.filedsetName}`}>
                <Input
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                    this.onChangeFacility(
                      FormFields.FACILITIES_DESCRIPTION,
                      evt.target.value
                    )
                  }
                  value={facility.facilities_description || ''}
                  disabled={!isEdit}
                  placeholder={'Main Stadium'}
                  label="Facility Name"
                  width="100%"
                />
              </fieldset>
              <fieldset className={`${styles.filedset} ${styles.filedsetName}`}>
                <PlacesAutocompleteInput
                  onSelect={this.onAdressSelect}
                  onChange={(address: string) =>
                    this.onChangeFacility(FormFields.ADDRESS_ONE, address)
                  }
                  address={facility.address1 || ''}
                  disabled={!isEdit}
                  label={'Facility Address'}
                />
              </fieldset>
              <div className={`${styles.filedset} ${styles.filedsetGameTimes}`}>
                <DatePicker
                  minWidth="100%"
                  label="First Game Start"
                  type="time"
                  value={timeToDate(facility.first_game_time || '')}
                  onChange={(date: Date) =>
                    this.onChangeFacility(
                      FormFields.FIRST_GAME_TIME,
                      dateToTime(date)
                    )
                  }
                  disabled={!isEdit}
                />
                <DatePicker
                  minWidth="100%"
                  label="Last Game End"
                  type="time"
                  value={timeToDate(facility.last_game_end || '')}
                  onChange={(date: Date) =>
                    this.onChangeFacility(
                      FormFields.LAST_GAME_END,
                      dateToTime(date)
                    )
                  }
                  disabled={!isEdit}
                />
              </div>
              <fieldset
                className={`${styles.filedset} ${styles.filedsetFields}`}
              >
                <Select
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = evt.target.value;

                    console.log(inputValue > fields.length.toString());

                    if (inputValue > fields.length.toString()) {
                      this.onChangeFacility(FormFields.NUM_FIELDS, +inputValue);

                      addEmptyField(facility.facilities_id);
                    }
                  }}
                  value={`${fields.length || ''}`}
                  options={Array.from(
                    new Array(fields.length + 1),
                    (_, idx) => ({
                      label: `${idx + 1}`,
                      value: `${idx + 1}`,
                    })
                  )}
                  width="100%"
                  label="Number of Fields"
                  disabled={!isEdit}
                />
              </fieldset>
            </div>
            <div className={styles.section}>
              {lat && lng && (
                <Map
                  position={{
                    lat,
                    lng,
                  }}
                />
              )}
            </div>
            <div className={`${styles.section} ${styles.btnContainer}`}>
              <Button
                onClick={this.onEditClick}
                label="Edit"
                variant={isEdit ? 'contained' : 'text'}
                color="secondary"
                type={isEdit ? 'danger' : undefined}
              />
            </div>
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
              <Select
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  this.onChangeFacility(FormFields.RESTROOM, evt.target.value)
                }
                value={facility.restrooms || ''}
                name="restrooms"
                options={['In Facility', 'Portable'].map(type => ({
                  label: type,
                  value: type,
                }))}
                disabled={!isEdit}
                width="100%"
                label="Restrooms"
              />
            </fieldset>
            <fieldset
              className={`${styles.filedset} ${styles.filedsetToiltes}`}
            >
              <Input
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  this.onChangeFacility(
                    FormFields.NUM_TOILETS,
                    evt.target.value
                  )
                }
                value={facility.num_toilets || ''}
                name={FormFields.NUM_TOILETS}
                disabled={!isEdit}
                width="100%"
                label="# Portable Toilets"
              />
            </fieldset>
          </div>
          <fieldset className={`${styles.filedset} ${styles.restroomDetails}`}>
            <Checkbox
              onChange={() =>
                this.setState(({ isRestRoomDetails }) => ({
                  isRestRoomDetails: !isRestRoomDetails,
                }))
              }
              options={[
                {
                  label: 'Restroom Details',
                  checked: isRestRoomDetails,
                  disabled: !isEdit,
                },
              ]}
            />
            {(isRestRoomDetails || facility.restroom_details) && (
              <Input
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  this.onChangeFacility(
                    FormFields.RESTROOM_DETAILS,
                    evt.target.value
                  )
                }
                value={facility.restroom_details || ''}
                disabled={!isEdit}
                width="100%"
              />
            )}
          </fieldset>
          <div className={styles.parkingWrapper}>
            <fieldset
              className={`${styles.filedset} ${styles.filedsetParkingAvailable}`}
            >
              <Select
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  this.onChangeFacility(
                    FormFields.PARKING_AVAILABLE,
                    evt.target.value
                  )
                }
                value={facility.parking_available || ''}
                name="parking_available"
                options={Object.keys(ParkingAvailableOptions).map(type => ({
                  label: ParkingAvailableOptions[type],
                  value: ParkingAvailableOptions[type],
                }))}
                width="100%"
                disabled={!isEdit}
                label="Parking Available"
              />
            </fieldset>
            <fieldset
              className={`${styles.filedset} ${styles.filedsetDistanceFields}`}
            >
              <Input
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  this.onChangeFacility(
                    FormFields.PARKING_PROXIMITY,
                    evt.target.value
                  )
                }
                value={facility.parking_proximity || ''}
                disabled={!isEdit}
                placeholder="Meters"
                width="100%"
                label="Main Parking - Distance to Fields (approx)"
              />
            </fieldset>
            <fieldset className={`${styles.filedset} ${styles.filedsetGolf}`}>
              <Checkbox
                onChange={() =>
                  this.onChangeFacility(
                    FormFields.GOLF_CARTS_AVAILABE,
                    facility.golf_carts_availabe ? 0 : 1
                  )
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
                this.setState(({ isParkingDetails }) => ({
                  isParkingDetails: !isParkingDetails,
                }))
              }
              options={[
                {
                  label: 'Parking Details',
                  checked: isParkingDetails,
                  disabled: !isEdit,
                },
              ]}
            />
            {(isParkingDetails || facility.parking_details) && (
              <>
                <div className={styles.parkingDetailsWrapper}>
                  <Input
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      this.onChangeFacility(
                        FormFields.PARKING_DETAILS,
                        evt.target.value
                      )
                    }
                    value={facility.parking_details || ''}
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
          <fieldset className={styles.filedset} disabled={!isEdit}>
            <FileUpload
              type={FileUploadTypes.BUTTON}
              acceptTypes={[AcceptFileTypes.PDF]}
              onUpload={this.onMapFileUpload}
            />
          </fieldset>
        </form>
      </SectionDropdown>
    );
  }
}

export default FacilityDetails;
