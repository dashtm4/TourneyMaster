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
  getDivisions,
} from './registration-edit/logic/actions';
import RegistrationEdit from 'components/registration/registration-edit';
import { IRegistration } from 'common/models/registration';
import { BindingCbWithOne, BindingCbWithTwo, IDivision } from 'common/models';
import { EventMenuRegistrationTitles } from 'common/enums';
import { History } from 'history';
import { Loader } from 'components/common';

interface IRegistrationState {
  registration?: Partial<IRegistration>;
  isEdit: boolean;
  expanded: boolean[];
  expandAll: boolean;
}

interface IRegistrationProps {
  getRegistration: BindingCbWithOne<string>;
  saveRegistration: BindingCbWithTwo<string | undefined, string>;
  getDivisions: BindingCbWithOne<string>;
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
    expanded: [true, true, true],
    expandAll: false,
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
  };

  onCancelClick = () => {
    this.setState({ isEdit: false });
  };

  onSaveClick = () => {
    this.props.saveRegistration(this.state.registration, this.eventId);
    this.setState({ isEdit: false });
  };

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
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

  renderView = () => {
    const { registration } = this.props;
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
                label={registration ? 'Edit' : 'Add'}
                variant="contained"
                color="primary"
                onClick={this.onRegistrationEdit}
              />
            </div>
          </Paper>
          <div className={styles.sectionContainer}>
            <div className={styles.heading}>
              <HeadingLevelTwo>Registration</HeadingLevelTwo>
              {registration && (
                <Button
                  label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
                  variant="text"
                  color="secondary"
                  onClick={this.onToggleAll}
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
                    isDefaultExpanded={true}
                    expanded={this.state.expanded[0]}
                    onToggle={() => this.onToggleOne(0)}
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
                    isDefaultExpanded={true}
                    expanded={this.state.expanded[1]}
                    onToggle={() => this.onToggleOne(1)}
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
                    isDefaultExpanded={true}
                    expanded={this.state.expanded[2]}
                    onToggle={() => this.onToggleOne(2)}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
