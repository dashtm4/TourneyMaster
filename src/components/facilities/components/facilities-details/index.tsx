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
import styles from './styles.module.scss';

interface Props {
  facilitiyNumber: number;
}

interface State {
  fieldCount: number;
  isRestroomDetails: boolean;
  isParkingDetails: boolean;
}

class FacilitiesDetails extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      fieldCount: 0,
      isRestroomDetails: false,
      isParkingDetails: false,
    };
  }

  onChangeFieldCount = (evt: any) => {
    this.setState({ fieldCount: evt.target.value });
  };

  onChangeRestroomDetails = (evt: any) => {
    this.setState({ isRestroomDetails: evt.target.checked });
  };

  onChangeParkingDetails = (evt: any) => {
    this.setState({ isParkingDetails: evt.target.checked });
  };

  render() {
    const { facilitiyNumber } = this.props;
    const { fieldCount, isRestroomDetails, isParkingDetails } = this.state;

    return (
      <ExpansionPanelWrapped>
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
                <TextField placeholder={'Main Stadium'} width="350px" />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  onChange={this.onChangeFieldCount}
                  value={`${fieldCount}`}
                  options={['1', '2', '3', '4']}
                  width="160px"
                />
              </fieldset>
            </div>
            <ul className={styles.fieldList}>
              {Array.from(new Array(+fieldCount), (_, idx) => (
                <li key={idx}>
                  <Field fieldNumber={idx + 1} />
                </li>
              ))}
            </ul>
            <div className={styles.restroomWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select
                  value="In Facility"
                  options={['In Facility', 'Portable']}
                  width="255px"
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField placeholder="5" width="250px" />
              </fieldset>
            </div>
            <fieldset
              className={`${styles.filedset} ${styles.restroomDetails}`}
            >
              <Checkbox
                onChange={this.onChangeRestroomDetails}
                options={['Restroom Details']}
              />
              {isRestroomDetails && <TextField width="100%" />}
            </fieldset>
            <div className={styles.parkingWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select value="Ample" options={['Ample']} width="160px" />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField placeholder="Metres" width="160px" />
              </fieldset>
              <fieldset className={`${styles.filedset} ${styles.filedsetGolf}`}>
                <legend className="visually-hidden">Golf Carts </legend>
                <Checkbox options={['Golf Carts Available']} />
              </fieldset>
            </div>
            <fieldset className={`${styles.filedset} ${styles.parkingDetails}`}>
              <Checkbox
                onChange={this.onChangeParkingDetails}
                options={['Parking Details']}
              />
              {isParkingDetails && <TextField width="100%" />}
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

export default FacilitiesDetails;
