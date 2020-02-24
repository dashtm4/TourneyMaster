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
import {
  getRegistration,
  saveRegistration,
} from './registration-edit/logic/actions';
import { getDivisions } from '../divisions-and-pools/logic/actions';
import RegistrationEdit from 'components/registration/registration-edit';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithOne, BindingCbWithTwo, IDisision } from 'common/models';
import { CircularProgress } from '@material-ui/core';
import { History } from 'history';

interface IRegistrationState {
  registration?: Partial<IRegistration>;
  isEdit: boolean;
}

interface IRegistrationProps {
  getRegistration: BindingCbWithOne<string>;
  saveRegistration: BindingCbWithTwo<string | undefined, string>;
  getDivisions: BindingCbWithOne<string>;
  registration: IRegistration;
  divisions: IDisision[];
  match: any;
  history: History;
  isLoading: boolean;
}

class RegistrationView extends React.Component<
  IRegistrationProps,
  IRegistrationState
> {
  eventId = this.props.match.params.eventId;
  state = { registration: undefined, isEdit: false };

  componentDidMount() {
    this.props.getRegistration(this.eventId);
    this.props.getDivisions(this.eventId);
  }

  componentDidUpdate(prevProps: IRegistrationProps) {
    if (this.props.registration !== prevProps.registration) {
      this.setState({
        registration: this.props.registration,
      });
    }
  }

  onRegistrationEdit = () => {
    this.setState({ isEdit: true });
  };

  onChange = (name: string, value: any) => {
    this.setState(({ registration }) => ({
      registration: {
        ...registration,
        [name]: value,
      },
    }));
  };

  onCancelClick = () => {
    this.setState({ isEdit: false });
  };

  onSaveClick = () => {
    this.props.saveRegistration(this.state.registration, this.eventId);
    this.setState({ isEdit: false });
  };

  static getDerivedStateFromProps(
    nextProps: IRegistrationProps,
    prevState: IRegistrationState
  ): Partial<IRegistrationState> | null {
    if (!prevState.registration && nextProps.registration) {
      return {
        registration: nextProps.registration,
      };
    }
    return null;
  }

  Loading = () => (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );

  renderView = (registration: Partial<IRegistration>) => {
    if (this.state.isEdit) {
      return (
        <RegistrationEdit
          registration={this.state.registration}
          onChange={this.onChange}
          onCancel={this.onCancelClick}
          onSave={this.onSaveClick}
        />
      );
    } else {
      return (
        <section>
          <Paper sticky={true}>
            <div className={styles.mainMenu}>
              <Button
                label="+ Add to Library"
                variant="text"
                color="secondary"
              />
              <Button
                label="Edit"
                variant="contained"
                color="primary"
                onClick={this.onRegistrationEdit}
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
                  panelDetailsType="flat"
                  isDefaultExpanded={true}
                >
                  <span>Primary Information</span>
                  <PrimaryInformation
                    eventId={this.eventId}
                    data={registration}
                    divisions={this.props.divisions.map(division => ({
                      name: division.long_name,
                      id: division.division_id,
                    }))}
                  />
                </SectionDropdown>
              </li>
              <li>
                <SectionDropdown
                  type="section"
                  panelDetailsType="flat"
                  isDefaultExpanded={true}
                >
                  <span>Teams & Athletes</span>
                  <TeamsAthletesInfo data={registration} />
                </SectionDropdown>
              </li>
              <li>
                <SectionDropdown
                  type="section"
                  panelDetailsType="flat"
                  isDefaultExpanded={true}
                >
                  <span>Main Contact</span>
                  <MainContact data={registration} />
                </SectionDropdown>
              </li>
            </ul>
          </div>
        </section>
      );
    }
  };

  render() {
    const { registration } = this.props;
    return (
      <>
        {this.props.isLoading && this.Loading()}
        {registration && !this.props.isLoading && this.renderView(registration)}
      </>
    );
  }
}

interface IState {
  registration: { data: IRegistration; isLoading: boolean };
  divisions: { data: IDisision[] };
}

const mapStateToProps = (state: IState) => ({
  registration: state.registration.data,
  isLoading: state.registration.isLoading,
  divisions: state.divisions.data,
});

const mapDispatchToProps = {
  getRegistration,
  saveRegistration,
  getDivisions,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
