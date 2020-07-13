import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import {
  EventMenuRegistrationTitles,
  EntryPoints,
  LibraryStates,
  IRegistrationFields,
} from 'common/enums';
import { IEntity } from 'common/types';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
  BindingCbWithThree,
  IDivision,
  IEventDetails,
  IRegistrant,
} from 'common/models';
import { IRegistration } from 'common/models/registration';
import { Loader, Toasts, Modal } from 'components/common';
import { addEntityToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import RegistrationEdit from 'components/registration/registration-edit';
import AddNewField from 'components/registration/data-request/add-new-field';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Button from '../common/buttons/button';
import SectionDropdown from '../common/section-dropdown';
import Navigation from './navigation';
import PricingAndCalendar from './pricing-and-calendar';
import RegistrationDetails from './registration-details';
import Registrants from './registrants';
import Payments from './payments';
import Waiver from './waiver';
import {
  getRegistration,
  saveRegistration,
  saveCustomData,
  getDivisions,
  getRegistrants,
} from './registration-edit/logic/actions';
import styles from './styles.module.scss';

interface IRegistrationState {
  registration?: Partial<IRegistration>;
  isEdit: boolean;
  isSectionsExpand: boolean;
  changesAreMade: boolean;
  event?: Partial<IEventDetails>;
  requestIds: any;
  options: any;
  isAddNewFieldOpen: boolean;
}

interface IRegistrationProps {
  getRegistration: BindingCbWithOne<string>;
  saveRegistration: BindingCbWithTwo<string | undefined, string>;
  saveCustomData: BindingCbWithThree<any, any, string>;
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
    requestIds: [],
    options: [],
    isAddNewFieldOpen: false,
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

  updateRequestIds = (id: number | string, status: string) => {
    const { requestIds } = this.state;

    switch (status) {
      case 'add':
        this.setState({
          requestIds: [...requestIds, id],
        });
        return;
      case 'remove':
        this.setState({
          requestIds: requestIds.filter((el: number | string) => el !== id),
        });
        return;
      default:
        return;
    }
  };

  updateOptions = (id: number | string, value: number, status: boolean) => {
    const { options } = this.state;

    if (status) {
      this.setState({
        options: { ...options, [id]: value },
      });
    } else {
      const newOptions = Object.keys(options)
        .filter(el => el.toString() !== id.toString())
        .map(el => ({ [el]: options[el] }));

      this.setState({
        options: newOptions,
      });
    }
  };

  onAddNewField = () => {
    this.setState({ isAddNewFieldOpen: true });
  };

  onAddNewFieldClose = () => {
    this.setState({
      isAddNewFieldOpen: false,
    });
  };

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
      const { requestIds, options } = this.state;

      this.props.saveRegistration(this.state.registration, this.eventId);
      this.props.saveCustomData(requestIds, options, this.eventId);
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
    const { requestIds, isAddNewFieldOpen } = this.state;
    const eventType = event && event[0].event_type;
    if (this.state.isEdit) {
      return (
        <>
          <RegistrationEdit
            event={event}
            registration={this.state.registration}
            onChange={this.onChange}
            onCancel={this.onCancelClick}
            onSave={this.onSaveClick}
            changesAreMade={this.state.changesAreMade}
            divisions={this.props.divisions}
            eventType={eventType}
            updateRequestIds={this.updateRequestIds}
            updateOptions={this.updateOptions}
            requestIds={requestIds}
            onAddNewField={this.onAddNewField}
          />
          <Modal isOpen={isAddNewFieldOpen} onClose={this.onAddNewFieldClose}>
            <AddNewField
              onCancel={this.onAddNewFieldClose}
              eventId={this.eventId}
            />
          </Modal>
        </>
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
  saveCustomData,
  getDivisions,
  getRegistrants,
  addEntityToLibrary,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationView);
