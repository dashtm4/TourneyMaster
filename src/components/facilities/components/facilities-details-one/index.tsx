import React from 'react';
import {
  ExpansionPanelWrapped,
  ExpansionPanelSummaryWrapped,
  ExpansionPanelDetailsWrapped,
} from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '../../../common/input';
import Select from '../../../common/select';
import styles from './styles.module.scss';

const facilitiesDetailsOne = () => (
  <ExpansionPanelWrapped>
    <ExpansionPanelSummaryWrapped expandIcon={<ExpandMoreIcon />}>
      <h2 className={styles.detailsSubtitle}>Facility 1 Details</h2>
    </ExpansionPanelSummaryWrapped>
    <ExpansionPanelDetailsWrapped>
      <form className={styles.form}>
        <h3 className={styles.detailsSubtitle}>Location 1</h3>
        <p className={styles.descripWrapper}>
          <span>The Proving Grounds</span>
          <button className={styles.editBtn}>Edit</button>
        </p>
        <div className={styles.nameWrapper}>
          <div className={styles.nameWrapperStadium}>
            <h3>Facility 1 Name</h3>
            <TextField label="Main Stadium" />
          </div>
          <div className={styles.nameWrapperField}>
            <h3>Number of Fields</h3>
            <Select
              value="none"
              options={['1', '2', '3']}
              label={'Choose number'}
            />
          </div>
        </div>
      </form>
    </ExpansionPanelDetailsWrapped>
  </ExpansionPanelWrapped>
);

export default facilitiesDetailsOne;
