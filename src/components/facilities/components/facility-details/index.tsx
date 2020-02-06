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

class FacilityDetails extends React.Component<Props> {
  onChangeFacility = ({ target: { name, value } }: any) => {
    const { facility, updateFacilities } = this.props;

    updateFacilities({ ...facility, isChange: true, [name]: value });
  };

  render() {
    const { facilitiyNumber, isOpen, facility } = this.props;

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
              <button className={styles.fromBtn} type="button">
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
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  onChange={this.onChangeFacility}
                  value={`${facility.fields ? facility.fields.length : ''}`}
                  name="num_fields"
                  options={
                    facility.fields
                      ? Array.from(
                          new Array(facility.fields.length + 1),
                          (_, idx) => `${idx + 1}`
                        )
                      : ['1']
                  }
                  width="160px"
                />
              </fieldset>
            </div>
            <ul className={styles.fieldList}>
              {facility.fields &&
                facility.fields.map((it, idx) => (
                  <li key={it.name}>
                    <Field fieldNumber={idx + 1} />
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
                options={['Restroom Details']}
                checked={Boolean(facility.restroom_details)}
              />
              {facility.restroom_details && (
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.restroom_details}
                  name="restroom_details"
                  width="100%"
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
                  options={['Golf Carts Available']}
                  checked={Boolean(facility.golf_carts_availabe)}
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
                options={['Parking Details']}
                checked={Boolean(facility.parking_details)}
              />
              {facility.parking_details && (
                <TextField
                  onChange={this.onChangeFacility}
                  value={facility.parking_details}
                  name="parking_details"
                  width="100%"
                />
              )}
            </fieldset>
            <button className={styles.fromBtn} type="button">
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
