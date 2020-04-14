import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';
import Navigation from './navigation';
import PrimaryInformation from './primary-information';
import TeamsAthletesInfo from './teams-athletes';
import MainContact from './main-contact';
import { connect } from 'react-redux';
import {
  getRegistration,
  saveRegistration,
  getDivisions,
} from './registration-edit/logic/actions';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import RegistrationEdit from 'components/registration/registration-edit';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithOne, BindingCbWithTwo, IDivision } from 'common/models';
import {
  EventMenuRegistrationTitles,
  EntryPoints,
  LibraryStates,
  IRegistrationFields,
} from 'common/enums';
import { History } from 'history';
import { Loader } from 'components/common';
import { IEntity } from 'common/types';

interface IRegistrationState {
  registration?: Partial<IRegistration>;
  isEdit: boolean;
  isSectionsExpand: boolean;
  changesAreMade: boolean;
}

interface IRegistrationProps {
  getRegistration: BindingCbWithOne<string>;
  saveRegistration: BindingCbWithTwo<string | undefined, string>;
  getDivisions: BindingCbWithOne<string>;
  addEntityToLibrary: BindingCbWithTwo<IEntity, EntryPoints>;
  registration: IRegistration;
  divisions: IDivision[];
  match: any;
  history: History;
  isLoading: boolean;
}

class RegistrationView extends React.Component<
  IRegistrationProps,
  IRegistrationState
> {
  eventId = this.props.match.params.eventId;
  state = {
    registration: undefined,
    isEdit: false,
    isSectionsExpand: true,
    changesAreMade: false,
  };

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

  onChange = (name: string, value: string | number) => {
    this.setState(({ registration }) => ({
      registration: {
        ...registration,
        [name]: value,
      },
    }));
    if (!this.state.changesAreMade) {
      this.setState({ changesAreMade: true });
    }
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

  onAddToLibraryManager = () => {
    const { registration } = this.state;

    if (
      ((registration as unknown) as IRegistration)?.is_library_YN ===
      LibraryStates.FALSE
    ) {
      this.onChange(IRegistrationFields.IS_LIBRARY_YN, LibraryStates.TRUE);
    }

    if (registration) {
      this.props.addEntityToLibrary(registration!, EntryPoints.REGISTRATIONS);
    }
  };

  toggleSectionCollapse = () => {
    this.setState({ isSectionsExpand: !this.state.isSectionsExpand });
  };

  renderView = () => {
    const { registration } = this.props;
    if (this.state.isEdit) {
      return (
        <RegistrationEdit
          registration={this.state.registration}
          onChange={this.onChange}
          onCancel={this.onCancelClick}
          onSave={this.onSaveClick}
          changesAreMade={this.state.changesAreMade}
        />
      );
    } else {
      return (
        <section className={styles.container}>
          <Navigation
            registration={registration}
            onRegistrationEdit={this.onRegistrationEdit}
            onAddToLibraryManager={this.onAddToLibraryManager}
          />
          <div className={styles.sectionContainer}>
            <div className={styles.heading}>
              <HeadingLevelTwo>Registration</HeadingLevelTwo>
              {registration && (
                <Button
                  label={
                    this.state.isSectionsExpand ? 'Collapse All' : 'Expand All'
                  }
                  variant="text"
                  color="secondary"
                  onClick={this.toggleSectionCollapse}
                />
              )}
            </div>
            {this.props.isLoading && <Loader />}
            {registration && !this.props.isLoading ? (
              <ul className={styles.libraryList}>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.PRIMARY_INFORMATION}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Primary Information</span>
                    <PrimaryInformation
                      eventId={this.eventId}
                      data={registration}
                      divisions={this.props.divisions.map(division => ({
                        name: division.short_name,
                        id: division.division_id,
                      }))}
                    />
                  </SectionDropdown>
                </li>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.TEAMS_AND_ATHLETES}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Teams & Athletes</span>
                    <TeamsAthletesInfo data={registration} />
                  </SectionDropdown>
                </li>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.MAIN_CONTACT}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Main Contact</span>
                    <MainContact data={registration} />
                  </SectionDropdown>
                </li>
              </ul>
            ) : (
              !this.props.isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>There is no registration yet.</span>
                </div>
              )
            )}
          </div>
        </section>
      );
    }
  };

  render() {
    return <>{this.renderView()}</>;
  }
}

interface IState {
  registration: {
    data: IRegistration;
    divisions: IDivision[];
    isLoading: boolean;
  };
}

const mapStateToProps = (state: IState) => ({
  registration: state.registration.data,
  isLoading: state.registration.isLoading,
  divisions: state.registration.divisions,
});

const mapDispatchToProps = {
  getRegistration,
  saveRegistration,
  getDivisions,
  addEntityToLibrary,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
