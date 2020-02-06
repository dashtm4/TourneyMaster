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
// import { IFacilityField } from '../../../../common/models/facilities';
import { BindingCbWithOne } from '../../../../common/models/callback';
import styles from './styles.module.scss';

interface Props {
  facility: IFacility;
  facilitiyNumber: number;
  isOpen: boolean;
  isSavingFacility: boolean;
  updateFacilities: BindingCbWithOne<any>;
}

interface State {
  facilities_description: string | null;
}

class FacilityDetails extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      facilities_description: this.props.facility.facilities_description,
    };
  }

  onChangeFacilitiesDescription = (evt: any) => {
    console.log(evt.target.value);

    this.setState({ facilities_description: evt.target.value });
  };

  componentDidUpdate() {
    const { isSavingFacility, updateFacilities } = this.props;
    const facility = this.state;

    if (isSavingFacility) {
      updateFacilities(Promise.resolve(facility));
    }
  }

  // onChangeRestroomDetails = (evt: any) => {
  //   this.setState({ isRestroomDetails: evt.target.checked });
  // };

  // onChangeParkingDetails = (evt: any) => {
  //   this.setState({ isParkingDetails: evt.target.checked });
  // };

  render() {
    const { facilitiyNumber, isOpen, facility } = this.props;
    // const { isRestroomDetails, isParkingDetails } = this.state;

    const { facilities_description } = this.state;

    return (
      <ExpansionPanelWrapped defaultExpanded={isOpen}>
        <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
          <h2 className={styles.detailsSubtitle}>
            Facility {facilitiyNumber} Details
          </h2>
        </ExpansionPanelSummaryWrapped>
        <ExpansionPanelDetailsWrapped>
          <form className={styles.form}>
            <h3 className={styles.detailsSubtitle}>Location 1</h3>
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
                  onChange={this.onChangeFacilitiesDescription}
                  value={facilities_description || ''}
                  placeholder={'Main Stadium'}
                  width="350px"
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  value={`${facility.fields ? facility.fields.length : ''}`}
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
                  value={facility.restrooms || 'In Facility'}
                  options={['In Facility', 'Portable']}
                  width="255px"
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField
                  value={facility.num_toilets ? `${facility.num_toilets}` : ''}
                  placeholder="5"
                  width="250px"
                />
              </fieldset>
            </div>
            <fieldset
              className={`${styles.filedset} ${styles.restroomDetails}`}
            >
              <Checkbox
                options={['Restroom Details']}
                checked={Boolean(facility.restroom_details)}
              />
              {facility.restroom_details && (
                <TextField value={facility.restroom_details} width="100%" />
              )}
            </fieldset>
            <div className={styles.parkingWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Parking Available</legend>
                <Select
                  value={facility.parking_available || 'Ample'}
                  options={['Ample', 'AmAmple', 'AmAmAmple']}
                  width="160px"
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  Distance to Fields
                </legend>
                <TextField
                  value={
                    facility.parking_proximity
                      ? `${facility.parking_proximity}`
                      : ''
                  }
                  placeholder="Metres"
                  width="160px"
                />
              </fieldset>
              <fieldset className={`${styles.filedset} ${styles.filedsetGolf}`}>
                <legend className="visually-hidden">Golf Carts </legend>
                <Checkbox
                  options={['Golf Carts Available']}
                  checked={Boolean(facility.golf_carts_availabe)}
                />
              </fieldset>
            </div>
            <fieldset className={`${styles.filedset} ${styles.parkingDetails}`}>
              <Checkbox
                options={['Parking Details']}
                checked={Boolean(facility.parking_details)}
              />
              {facility.parking_details && (
                <TextField value={facility.parking_details} width="100%" />
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
