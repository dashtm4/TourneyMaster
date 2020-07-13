import React from 'react';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import styles from './styles.module.scss';
import Navigation from './navigation';
import PricingAndCalendar from './pricing-and-calendar';
import RegistrationDetails from './registration-details';
import Registrants from './registrants';
import Payments from './payments';
import { connect } from 'react-redux';
import {
  getRegistration,
  saveRegistration,
  getDivisions,
  getRegistrants,
} from './registration-edit/logic/actions';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import RegistrationEdit from 'components/registration/registration-edit';
import { IRegistration, IWelcomeSettings } from 'common/models/registration';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
  IDivision,
  IEventDetails,
  IRegistrant,
} from 'common/models';
import {
  EventMenuRegistrationTitles,
  EntryPoints,
  LibraryStates,
  IRegistrationFields,
} from 'common/enums';
import { History } from 'history';
import { Loader, Toasts } from 'components/common';
import { IEntity } from 'common/types';
import Waiver from './waiver';
import EmailReceipts from "./email-receipts";

interface IRegistrationState {
  registration?: Partial<IRegistration>;
  isEdit: boolean;
  isSectionsExpand: boolean;
  changesAreMade: boolean;
  event?: Partial<IEventDetails>;
}

interface IRegistrationProps {
  getRegistration: BindingCbWithOne<string>;
  saveRegistration: BindingCbWithTwo<string | undefined, string>;
  getDivisions: BindingCbWithOne<string>;
  getRegistrants: BindingCbWithOne<string>;
  getRegistrantPayments: BindingCbWithOne<string>;
  addEntityToLibrary: BindingCbWithTwo<IEntity, EntryPoints>;
  registration: IRegistration;
  divisions: IDivision[];
  registrants: IRegistrant[];
  match: any;
  history: History;
  isLoading: boolean;
  event: IEventDetails;
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
    event: undefined,
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
    if (this.props.event !== prevProps.event) {
      this.setState({
        event: this.props.event,
      });
    }
  }

  onRegistrationEdit = () => {
    this.setState({ isEdit: true });
  };

  onChange = (name: string, value: string | number | IWelcomeSettings) => {
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
    this.setState({
      isEdit: false,
      registration: undefined,
      changesAreMade: false,
    });
  };

  scheduleIsValid = (registration: any) => {
    const schedule = registration.payment_schedule_json
      ? JSON.parse(registration.payment_schedule_json!)?.find(
          (x: any) => x.type === 'schedule'
        )
      : null;
    return (
      !schedule ||
      schedule?.schedule?.reduce(
        (sum: number, phase: any) => sum + Number(phase.amount),
        0
      ) === 100
    );
  };

  onSaveClick = () => {
    if (this.scheduleIsValid(this.state.registration)) {
      this.props.saveRegistration(this.state.registration, this.eventId);
      this.setState({ isEdit: false, changesAreMade: false });
    } else {
      Toasts.errorToast('Total schedule amount must be equal to 100%');
    }
  };

  static getDerivedStateFromProps(
    nextProps: IRegistrationProps,
    prevState: IRegistrationState
  ): Partial<IRegistrationState> | null {
    if (!prevState.registration && nextProps.registration) {
      return {
        registration: nextProps.registration,
        event: nextProps.event,
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
    const { registration, event } = this.props;
    if (!event) {
      return;
    }
    const eventType = event[0] && event[0].event_type;
    if (this.state.isEdit) {
      return (
        <RegistrationEdit
          event={event}
          registration={this.state.registration}
          onChange={this.onChange}
          onCancel={this.onCancelClick}
          onSave={this.onSaveClick}
          changesAreMade={this.state.changesAreMade}
          divisions={this.props.divisions}
          eventType={eventType}
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
            {!this.props.isLoading && registration ? (
              <ul className={styles.libraryList}>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.PRICING_AND_CALENDAR}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Pricing &amp; Calendar</span>
                    <PricingAndCalendar
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
                    id={EventMenuRegistrationTitles.REGISTRATION_DETAILS}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Registration Details</span>
                    <RegistrationDetails
                      data={registration}
                      eventType={eventType}
                    />
                  </SectionDropdown>
                </li>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.PAYMENTS}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Payments</span>
                    <Payments data={registration} />
                  </SectionDropdown>
                </li>
                {event && event[0].waivers_required === 1 ? (
                  <li>
                    <SectionDropdown
                      id={EventMenuRegistrationTitles.WAIVER}
                      type="section"
                      panelDetailsType="flat"
                      isDefaultExpanded={true}
                      expanded={this.state.isSectionsExpand}
                    >
                      <span>Waivers & Wellness</span>
                      <div className={styles.waiverWrapp}>
                        <Waiver data={registration} isEdit={false} />
                      </div>
                    </SectionDropdown>
                  </li>
                ) : null}
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.REGISTRANTS}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Registrants</span>
                    <Registrants />
                  </SectionDropdown>
                </li>
                <li>
                  <SectionDropdown
                    id={EventMenuRegistrationTitles.REGISTRANTS}
                    type="section"
                    panelDetailsType="flat"
                    expanded={this.state.isSectionsExpand}
                  >
                    <span>Email Receipts</span>
                    <EmailReceipts data={registration}/>
                  </SectionDropdown>
                </li>
              </ul>
            ) : (
              !this.props.isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>
                    There are currently no registrations. Start with the "Add"
                    button.
                  </span>
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
    registrants: IRegistrant[];
    isLoading: boolean;
    event: IEventDetails;
  };
}

const mapStateToProps = (state: IState) => ({
  registration: state.registration.data,
  isLoading: state.registration.isLoading,
  divisions: state.registration.divisions,
  registrants: state.registration.registrants,
  event: state.registration.event,
});

const mapDispatchToProps = {
  getRegistration,
  saveRegistration,
  getDivisions,
  getRegistrants,
  addEntityToLibrary,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
