import React from 'react';
import styles from '../create-backup-modal/styles.module.scss';
import { Input, Select, Radio, CardMessage, Loader } from 'components/common';
import { BindingCbWithThree, IFacility, IEventDetails } from 'common/models';
import { IField } from 'common/models';
import MultipleSearch from 'components/common/multiple-search-select';
import {
  getFacilitiesOptionsForEvent,
  getFieldsOptionsForFacilities,
  getEventOptions,
  getTimeSlotOptions,
} from '../helper';
import { CardMessageTypes } from 'components/common/card-message/types';
import { IComplexityTimeslots } from '../common';

import MultiSelect, {
  IMultiSelectOption,
} from 'components/common/multi-select';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  index: number;
  backupPlan: any;
  onChange: BindingCbWithThree<string, any, number>;
  loadTimeSlots: (eventId: string) => void;
  events: IEventDetails[];
  facilities: IFacility[];
  fields: IField[];
  timeSlots: IComplexityTimeslots;
}

export interface IMultipleSelectOption {
  label: string;
  value: string;
}

export enum OptionsEnum {
  'Cancel Games' = 'cancel_games',
  'Modify Start Times' = 'modify_start_time',
  'Modify Game Lengths' = 'modify_game_lengths',
}

export enum TypeOptionsEnum {
  'cancel_games' = 'Cancel Games',
  'modify_start_time' = 'Modify Start Times',
  'modify_game_lengths' = 'Modify Game Lengths',
}

class CreateBackupForm extends React.Component<Props> {
  onNameChange = (e: InputTargetValue) =>
    this.props.onChange('backup_name', e.target.value, this.props.index);

  onTournamentChange = (e: InputTargetValue) => {
    this.props.onChange('event_id', e.target.value, this.props.index);
    this.props.onChange('facilities_impacted', '', this.props.index);
    this.props.onChange('fields_impacted', '', this.props.index);
    this.props.onChange('timeslots_impacted', '', this.props.index);
  };

  onTypeChange = (e: InputTargetValue) => {
    this.props.onChange(
      'backup_type',
      OptionsEnum[e.target.value],
      this.props.index
    );
    this.props.onChange('timeslots_impacted', '', this.props.index);
  };

  onFacilitiesChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.props.onChange('facilities_impacted', values, this.props.index);
  };

  onFieldsChange = (_name: string, values: IMultiSelectOption[]) => {
    const { backupPlan, timeSlots } = this.props;
    const { event_id } = backupPlan;
    const eventTimeSlots = timeSlots[event_id];
    const checkedField = values.filter(it => Boolean(it.checked));

    if (event_id && !eventTimeSlots) {
      this.props.loadTimeSlots(event_id);
    }

    this.props.onChange('fields_impacted', checkedField, this.props.index);
  };

  onTimeslotsChange = (
    _event: InputTargetValue,
    values: IMultipleSelectOption[]
  ) => {
    this.props.onChange('timeslots_impacted', values, this.props.index);
  };

  onTimeslotChange = (e: InputTargetValue) =>
    this.props.onChange('timeslots_impacted', e.target.value, this.props.index);

  onChangeToChange = (e: InputTargetValue) =>
    this.props.onChange('change_value', e.target.value, this.props.index);

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

    switch (type) {
      case 'cancel_games':
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
      case 'modify_start_time':
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
      case 'modify_game_lengths':
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
      backupPlan,
    } = this.props;

    const {
      backup_name,
      event_id,
      backup_type,
      facilities_impacted,
      fields_impacted,
      timeslots_impacted,
      change_value,
    } = backupPlan;

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
      <div className={styles.formContainer}>
        <div style={{ paddingTop: '15px' }}>
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            Modifications only allowed to Published Schedules for each event.
          </CardMessage>
        </div>
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
              options={[
                'Cancel Games',
                'Modify Start Times',
                'Modify Game Lengths',
              ]}
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
            this.renderTimeslots(backup_type, timeslots_impacted, change_value)
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
    );
  }
}

export default CreateBackupForm;
