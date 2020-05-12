import React from 'react';
import { Input, Select, Radio, Button, Loader } from 'components/common';
import {
  IFacility,
  BindingCbWithOne,
  BindingAction,
  IEventDetails,
} from 'common/models';
import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';
import { IField } from 'common/models';
import MultipleSearch from 'components/common/multiple-search-select';
import styles from '../create-backup-modal/styles.module.scss';
import {
  mapFacilitiesToOptions,
  mapFieldsToOptions,
  mapTimeslotsToOptions,
  getFacilitiesOptionsForEvent,
  getFieldsOptionsForFacilities,
  getEventOptions,
  getTimeSlotOptions,
} from '../helper';
import { IBackupPlan } from 'common/models/backup_plan';
import { IMultipleSelectOption } from '../create-backup-form';
import { PopupExposure } from 'components/common';
import { IComplexityTimeslots, OptionsEnum, TypeOptionsEnum } from '../common';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  backupPlan: IBackupPlan;
  events: IEventDetails[];
  facilities: IFacility[];
  fields: IField[];
  timeSlots: IComplexityTimeslots;
  updateBackupPlan: BindingCbWithOne<Partial<IBackupPlan>>;
  loadTimeSlots: (eventId: string) => void;
  onEditClose: BindingAction;
}

interface State {
  backupPlan: any;
  isModalConfirmOpen: boolean;
}

class CreateBackupForm extends React.Component<Props, State> {
  state = { backupPlan: {}, isModalConfirmOpen: false };

  componentDidMount() {
    const { backupPlan, timeSlots } = this.props;
    const { event_id } = backupPlan;
    const eventTimeSlots = timeSlots[event_id];

    if (event_id && !eventTimeSlots) {
      this.props.loadTimeSlots(event_id);
    }

    this.setState({
      backupPlan: {
        ...this.props.backupPlan,
        facilities_impacted: mapFacilitiesToOptions(
          this.props.facilities,
          this.props.backupPlan.facilities_impacted
        ),
        fields_impacted: mapFieldsToOptions(
          this.props.fields,
          this.props.backupPlan.fields_impacted
        ),
        timeslots_impacted:
          this.props.backupPlan.timeslots_impacted &&
          mapTimeslotsToOptions(
            this.props.backupPlan.timeslots_impacted,
            this.props.backupPlan.backup_type
          ),
      },
    });
  }

  onChange = (name: string, value: any) => {
    this.setState(({ backupPlan }) => ({
      backupPlan: { ...backupPlan, [name]: value },
    }));
  };

  onNameChange = (e: InputTargetValue) =>
    this.onChange('backup_name', e.target.value);

  onTournamentChange = (e: InputTargetValue) => {
    this.onChange('event_id', e.target.value);
    this.onChange('facilities_impacted', '');
    this.onChange('fields_impacted', '');
    this.onChange('timeslots_impacted', undefined);
    this.onChange('change_value', undefined);
  };

  onTypeChange = (e: InputTargetValue) => {
    this.onChange('backup_type', OptionsEnum[e.target.value]);
    this.onChange('timeslots_impacted', '');
    this.onChange('change_value', undefined);
  };

  onFacilitiesChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.onChange('facilities_impacted', values);
  };

  onFieldsChange = (name: string, values: IMultiSelectOption[]) => {
    const checkedField = values.filter(it => Boolean(it.checked));

    this.onChange(name, checkedField);
  };

  onTimeslotsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.onChange('timeslots_impacted', values);
  };

  onTimeslotChange = (e: InputTargetValue) =>
    this.onChange('timeslots_impacted', e.target.value);

  onChangeToChange = (e: InputTargetValue) =>
    this.onChange('change_value', e.target.value);

  onSave = () => {
    if (this.state.isModalConfirmOpen) {
      this.setState({ isModalConfirmOpen: false });
    }
    this.props.updateBackupPlan(this.state.backupPlan);
    this.props.onEditClose();
  };

  onCancelClick = () => {
    this.setState({ isModalConfirmOpen: true });
  };

  onModalConfirmClose = () => {
    this.setState({ isModalConfirmOpen: false });
  };

  onExit = () => {
    this.setState({ isModalConfirmOpen: false });
    this.props.onEditClose();
  };

  renderTimeslots = (type: string, timeslots: any, changeTo: string) => {
    const { backupPlan, timeSlots } = this.props;
    const { event_id } = backupPlan;
    const eventTimeSlots = timeSlots[event_id];

    if (
      eventTimeSlots &&
      eventTimeSlots.isLoaded &&
      eventTimeSlots.eventTimeSlots.length === 0
    ) {
      return null;
    }

    const timeSlotOptions = getTimeSlotOptions(eventTimeSlots);

    switch (String(type)) {
      case OptionsEnum['Cancel Games']:
        return (
          <div className={styles.item}>
            <MultipleSearch
              label="Timeslots"
              width={'282px'}
              options={timeSlotOptions}
              onChange={this.onTimeslotsChange}
              value={timeslots || []}
            />
          </div>
        );
      case OptionsEnum['Close Fields & Move Games']:
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={timeSlotOptions}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotChange}
            />
            <Select
              label="Change To"
              options={timeSlotOptions}
              width={'131px'}
              value={changeTo || ''}
              onChange={this.onChangeToChange}
            />
          </div>
        );
      case OptionsEnum['Modify Game & Subsequent TimeSlots']:
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={timeSlotOptions}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotChange}
            />
            <Input
              width={'131px'}
              type={'number'}
              label="Change To"
              placeholder="Minutes"
              onChange={this.onChangeToChange}
              value={changeTo || ''}
            />
          </div>
        );
    }
  };

  render() {
    const {
      events,
      facilities: allFacilities,
      fields: allFields,
      timeSlots,
    } = this.props;

    const {
      backup_name,
      event_id,
      backup_type,
      facilities_impacted,
      fields_impacted,
      timeslots_impacted,
      change_value,
    }: any = this.state.backupPlan;

    const eventsOptions = getEventOptions(events);

    const facilitiesOptions = getFacilitiesOptionsForEvent(
      allFacilities,
      event_id
    );

    const fieldsOptions =
      facilities_impacted &&
      getFieldsOptionsForFacilities(
        allFields,
        facilities_impacted,
        fields_impacted
      );

    const eventTimeSlots = timeSlots[event_id];

    return (
      <div className={styles.container}>
        <div className={styles.title}>Edit Backup</div>
        <div className={styles.formContainer}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Input
                fullWidth={true}
                label="Name"
                onChange={this.onNameChange}
                value={backup_name || ''}
                autofocus={true}
              />
            </div>
            <div className={styles.item}>
              <Select
                label="Event Impacted"
                options={eventsOptions}
                onChange={this.onTournamentChange}
                value={event_id || ''}
              />
            </div>
            <div className={styles.itemLarge}>
              <Radio
                row={true}
                options={Object.values(TypeOptionsEnum)}
                formLabel="Type"
                onChange={this.onTypeChange}
                checked={
                  TypeOptionsEnum[backup_type] || OptionsEnum['Cancel Game']
                }
              />
            </div>
          </div>
          <div className={styles.row}>
            {event_id && (
              <div className={styles.item}>
                <MultipleSearch
                  label="Facilities Impacted"
                  width={'282px'}
                  options={facilitiesOptions}
                  onChange={this.onFacilitiesChange}
                  value={facilities_impacted || []}
                />
              </div>
            )}

            {facilities_impacted?.length ? (
              <div className={styles.item}>
                <MultiSelect
                  label="Fields Impacted"
                  name="fields_impacted"
                  width="282px"
                  selectOptions={fieldsOptions}
                  onChange={this.onFieldsChange}
                />
              </div>
            ) : null}

            {eventTimeSlots && eventTimeSlots.isLoading ? (
              <Loader />
            ) : fields_impacted?.length ? (
              this.renderTimeslots(
                backup_type,
                timeslots_impacted,
                change_value
              )
            ) : null}

            {/* {event_id && (
              <div className={styles.item}>
                <>
                  <span>or</span>
                  <Button
                    label="Open Scheduler"
                    variant="text"
                    color="secondary"
                  />
                </>
              </div>
            )} */}
          </div>
        </div>
        <div className={styles.buttonsGroup}>
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
            onClick={this.onSave}
          />
        </div>
        <PopupExposure
          isOpen={this.state.isModalConfirmOpen}
          onClose={this.onModalConfirmClose}
          onExitClick={this.onExit}
          onSaveClick={this.onSave}
        />
      </div>
    );
  }
}

export default CreateBackupForm;
