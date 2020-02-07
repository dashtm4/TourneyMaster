import React from 'react';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapped,
} from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PublishIcon from '@material-ui/icons/Publish';
import Field from '../field';
import TextField from '../../../common/input';
import Select from '../../../common/select';
import Checkbox from '../../../common/buttons/checkbox';
import { IFacility } from '../../../../common/models/facilities';
import { BindingCbWithOne } from '../../../../common/models/callback';
import styles from './styles.module.scss';

interface Props {
  facility: IFacility;
  facilitiyNumber: number;
  isOpen: boolean;
  updateFacilities: BindingCbWithOne<IFacility>;
}

interface State {
  isEdit: boolean;
}

class FacilityDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEdit: false,
    };
  }

  onChangeFacility = ({ target: { name, value } }: any) => {
    const { facility, updateFacilities } = this.props;

    console.log(name);
    console.log(value);

    updateFacilities({ ...facility, isChange: true, [name]: value });
  };

  onEditClick = () => this.setState(({ isEdit }) => ({ isEdit: !isEdit }));

  render() {
    const { facilitiyNumber, isOpen, facility } = this.props;
    const { isEdit } = this.state;

    return (
      <ExpansionPanelWrapped defaultExpanded={isOpen}>
        <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
          <h2 className={styles.detailsSubtitle}>
            Facility {facilitiyNumber} Details
          </h2>
        </ExpansionPanelSummaryWrapped>
        <ExpansionPanelDetailsWrapped>
          <form className={styles.form}>
            <h3 className={styles.detailsSubtitle}>
              Location {facilitiyNumber}
            </h3>
            <p className={styles.descripWrapper}>
              <span>The Proving Grounds</span>
              <button
                onClick={this.onEditClick}
                className={`${styles.editBtn} ${
                  isEdit ? styles.editBtnEdit : ''
                }`}
                type="button"
              >
                Edit
              </button>
            </p>
            <div className={styles.nameWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Facility 1 Name</legend>
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.facilities_description || ''}
                  name="facilities_description"
                  placeholder={'Main Stadium'}
                  width="350px"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={`${facility.num_fields || ''}`}
                  name="num_fields"
                  options={
                    facility.num_fields
                      ? Array.from(
                          new Array(+facility.num_fields + 1),
                          (_, idx) => `${idx + 1}`
                        )
                      : ['1']
                  }
                  width="160px"
                  disabled={!isEdit}
                />
              </fieldset>
            </div>
            <ul className={styles.fieldList}>
              {facility.num_fields &&
                Array.from(new Array(+facility.num_fields), (_, idx) => (
                  <li key={idx}>
                    <Field fieldNumber={idx + 1} isEdit={isEdit} />
                  </li>
                ))}
            </ul>
            <div className={styles.restroomWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={facility.restrooms || 'In Facility'}
                  name="restrooms"
                  options={['In Facility', 'Portable']}
                  width="255px"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.num_toilets ? `${facility.num_toilets}` : ''}
                  name="num_toilets"
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
                      name: 'restroom_details',
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
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.restroom_details}
                  name="restroom_details"
                  width="100%"
                  disabled={!isEdit}
                />
              )}
            </fieldset>
            <div className={styles.parkingWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Parking Available</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={facility.parking_available || 'Ample'}
                  name="parking_available"
                  options={['Ample', 'AmAmple', 'AmAmAmple']}
                  width="160px"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  Distance to Fields
                </legend>
                <TextField
                  onChange={this.onChangeFacility}
                  value={
                    facility.parking_proximity
                      ? `${facility.parking_proximity}`
                      : ''
                  }
                  name="parking_proximity"
                  placeholder="Metres"
                  width="160px"
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className={`${styles.filedset} ${styles.filedsetGolf}`}>
                <legend className="visually-hidden">Golf Carts </legend>
                <Checkbox
                  onChange={() =>
                    this.onChangeFacility({
                      target: {
                        name: 'golf_carts_availabe',
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
                      name: 'parking_details',
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
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.parking_details}
                  name="parking_details"
                  width="100%"
                  disabled={!isEdit}
                />
              )}
            </fieldset>
            <button className={styles.mapBtn} type="button" disabled={!isEdit}>
              <PublishIcon />
              Upload Field Maps
            </button>
          </form>
        </ExpansionPanelDetailsWrapped>
      </ExpansionPanelWrapped>
    );
  }
}

export default FacilityDetails;
