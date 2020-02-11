import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import PrimaryInformation from './primary-information';
import TeamsAthletesInfo from './teams-athletes';
import MainContact from './main-contact';
import { connect } from 'react-redux';
import { getRegistration } from './logic/actions';
import { History } from 'history';

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

interface IRegistrationEditState {
  registration: any;
}

interface IRegistrationEditProps {
  history: History;
  registration: any;
  getRegistration: () => void;
}

class RegistrationEdit extends React.Component<IRegistrationEditProps, IState> {
  state: IRegistrationEditState = {
    registration: undefined,
  };

  componentDidMount() {
    // TODO get with eventId
    this.props.getRegistration();
  }

  onChange = (name: string, value: any) => {
    this.setState(({ registration }: any) => ({
      registration: {
        ...registration,
        [name]: value,
      },
    }));
  };

  onCancelClick = () => {
    this.props.history.goBack();
  };

  onSaveClick = () => {
    // TODO: save data
    this.props.history.goBack();
  };

  render() {
    console.log(this.state.registration);
    return (
      <section>
        <Paper>
          <div className={styles.mainMenu}>
            <div>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.onCancelClick}
              />
              <Button
                label="Save"
                variant="contained"
                color="primary"
                onClick={this.onSaveClick}
              />
            </div>
          </div>
        </Paper>
        <div className={styles.sectionContainer}>
          <div className={styles.heading}>
            <HeadingLevelTwo>Registration</HeadingLevelTwo>
          </div>
          <ul className={styles.libraryList}>
            <li>
              <SectionDropdown type="section" padding="0">
                <span>Primary Information</span>
                <PrimaryInformation
                  data={primaryInformation}
                  onChange={this.onChange}
                />
              </SectionDropdown>
            </li>
            <li>
              <SectionDropdown type="section" padding="0">
                <span>Teams & Athletes</span>
                <TeamsAthletesInfo data={teamsInfo} onChange={this.onChange} />
              </SectionDropdown>
            </li>
            <li>
              <SectionDropdown type="section" padding="0">
                <span>Main Contact</span>
                <MainContact data={mainContact} onChange={this.onChange} />
              </SectionDropdown>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

interface IState {
  registration: { data: any };
}

const mapStateToProps = (state: IState) => ({
  registration: state.registration.data,
});

const mapDispatchToProps = {
  getRegistration,
};
export default connect(mapStateToProps, mapDispatchToProps)(RegistrationEdit);
