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

const FIELD_COUNT = 4;

class facilitiesDetailsOne extends React.Component {
  render() {
    return (
      <ExpansionPanelWrapped>
        <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
          <h2 className={styles.detailsSubtitle}>Facility 1 Details</h2>
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
                <TextField label="Main Stadium" />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Number of Fields</legend>
                <Select
                  value="none"
                  options={['1', '2', '3']}
                  label={'Choose number'}
                />
              </fieldset>
            </div>
            <ul className={styles.fieldList}>
              {Array.from(new Array(FIELD_COUNT), (_, idx) => (
                <li key={idx}>
                  <Field fieldNumber={idx + 1} />
                </li>
              ))}
            </ul>
            <div className={styles.restroomWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select
                  value="none"
                  options={['In Facility', 'Portable']}
                  label={'In Facility, Portable'}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField label="Count" />
              </fieldset>
            </div>
            <fieldset
              className={`${styles.filedset} ${styles.restroomDetails}`}
            >
              <Checkbox options={['Restroom Details']} />
              <TextField label="Details" />
            </fieldset>
            <div className={styles.parkingWrapper}>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>Restrooms</legend>
                <Select
                  value="none"
                  options={['Ample']}
                  label={'Ample, Portable'}
                />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className={styles.fieldTitle}>
                  # Portable Toilets
                </legend>
                <TextField label="Metres" />
              </fieldset>
              <fieldset className={styles.filedset}>
                <legend className="visually-hidden">Golf Carts </legend>
                <Checkbox options={['Golf Carts Available']} />
              </fieldset>
            </div>
            <fieldset className={`${styles.filedset} ${styles.parkingDetails}`}>
              <Checkbox options={['Parking Details']} />
              <TextField label="Details" />
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

export default facilitiesDetailsOne;
