import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import PrimaryInformation from './primary-information';
import TeamsAthletesInfo from './teams-athletes';
import MainContact from './main-contact';

const primaryInformation = {
  division: '2020, 2021',
  openDate: '01/01/20',
  closeDate: '01/31/20',
  entryFee: '$100.00',
  depositFee: '$25.00',
  earlyBirdDiscount: 'None',
  discountEndDate: '',
};
const teamsInfo = {
  maxTeamsPerDiv: '',
  minOnRoster: '',
  maxOnRoster: '',
  athleteBirth: 'Require',
  athleteJersey: 'Require',
  athleteEmail: 'Require',
};

const mainContact = {
  first: 'John',
  last: 'Anderson',
  role: 'None',
  email: 'janderson@gmail.com',
  mobile: '612-456-8203',
  permissionToText: 'No',
};

const RegistrationView = (props: any) => {
  const onRegistrationEdit = () => {
    const eventId = props.match.params.eventId;
    const path = eventId
      ? `/event/registration-edit/${eventId}`
      : '/event/registration-edit';
    props.history.push(path);
  };
  return (
    <section>
      <Paper>
        <div className={styles.mainMenu}>
          <Button label="+ Add to Library" variant="text" color="secondary" />
          <Button
            label="Edit"
            variant="contained"
            color="primary"
            onClick={onRegistrationEdit}
          />
        </div>
      </Paper>
      <div className={styles.sectionContainer}>
        <div className={styles.heading}>
          <HeadingLevelTwo>Registration</HeadingLevelTwo>
        </div>
        <ul className={styles.libraryList}>
          <li>
            <SectionDropdown
              type="section"
              padding="0"
              isDefaultExpanded={true}
            >
              <span>Primary Information</span>
              <PrimaryInformation data={primaryInformation} />
            </SectionDropdown>
          </li>
          <li>
            <SectionDropdown
              type="section"
              padding="0"
              isDefaultExpanded={true}
            >
              <span>Teams & Athletes</span>
              <TeamsAthletesInfo data={teamsInfo} />
            </SectionDropdown>
          </li>
          <li>
            <SectionDropdown
              type="section"
              padding="0"
              isDefaultExpanded={true}
            >
              <span>Main Contact</span>
              <MainContact data={mainContact} />
            </SectionDropdown>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default RegistrationView;
