import React from 'react';
import styles from '../create-backup-modal/styles.module.scss';
import { Input, Select, Radio, Button } from 'components/common';
import { BindingCbWithThree, IFacility } from 'common/models';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { IField } from 'common/models';
import MultipleSearch from 'components/common/multiple-search-select';

const options = [{ value: 'Option', label: 'Option' }];

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  index: number;
  backupPlan: any;
  onChange: BindingCbWithThree<string, string, number>;
  events: EventDetailsDTO[];
  facilities: IFacility[];
  fields: IField[];
}

enum OptionsEnum {
  'Cancel Games' = 1,
  'Modify Start Times' = 2,
  'Modify Game Lengths' = 3,
}

class CreateBackupForm extends React.Component<Props> {
  onNameChange = (e: InputTargetValue) =>
    this.props.onChange('name', e.target.value, this.props.index);

  onTournamentChange = (e: InputTargetValue) =>
    this.props.onChange('tournament', e.target.value, this.props.index);

  onTypeChange = (e: InputTargetValue) =>
    this.props.onChange('type', OptionsEnum[e.target.value], this.props.index);

  onFacilitiesChange = (_event: InputTargetValue, values: any) => {
    this.props.onChange('facilities', values, this.props.index);
  };

  onFieldsChange = (_event: InputTargetValue, values: any) =>
    this.props.onChange('fields', values, this.props.index);

  onTimeslotsChange = (e: InputTargetValue) =>
    this.props.onChange('timeslots', e.target.value, this.props.index);

  onChangeToChange = (e: InputTargetValue) =>
    this.props.onChange('change_to', e.target.value, this.props.index);

  onLengthsChange = (e: InputTargetValue) =>
    this.props.onChange('lengths', e.target.value, this.props.index);

  renderTimeslots = (
    type: string,
    timeslots: string,
    changeTo: string,
    changeLengths: string
  ) => {
    switch (String(type)) {
      case '1':
        return (
          <div className={styles.item}>
            <Select
              label="Timeslots"
              options={options}
              width={'282px'}
              value={timeslots || ''}
              onChange={this.onTimeslotsChange}
            />
          </div>
        );
      case '2':
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={options}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotsChange}
            />
            <Select
              label="Change To"
              options={options}
              width={'131px'}
              value={changeTo || ''}
              onChange={this.onChangeToChange}
            />
          </div>
        );
      case '3':
        return (
          <div className={styles.itemDouble}>
            <Select
              label="Timeslot"
              options={options}
              width={'131px'}
              value={timeslots || ''}
              onChange={this.onTimeslotsChange}
            />
            <Input
              width={'131px'}
              type={'number'}
              label="Change To"
              placeholder="Minutes"
              onChange={this.onLengthsChange}
              value={changeLengths || ''}
            />
          </div>
        );
    }
  };

  render() {
    const {
      name,
      tournament,
      type,
      facilities,
      fields,
      timeslots,
      change_to,
      lengths,
    } = this.props.backupPlan;
    const { events, facilities: allFacilities, fields: allFields } = this.props;

    const eventsOptions = events.map(event => ({
      label: event.event_name,
      value: event.event_id,
    }));

    const facilitiesOptions = allFacilities
      .filter(facility => facility.event_id === tournament)
      .map(facility => ({
        label: facility.facilities_description,
        value: facility.facilities_id,
      }));

    const fieldsOptions = allFields
      .filter(
        field =>
          facilities &&
          facilities
            .map((fac: { label: string; value: string }) => fac.value)
            .includes(field.facilities_id)
      )
      .map(field => ({ label: field.field_name, value: field.field_id }));

    return (
      <div className={styles.formContainer}>
        <div className={styles.row}>
          <div className={styles.item}>
            <Input
              fullWidth={true}
              label="Name"
              onChange={this.onNameChange}
              value={name || ''}
            />
          </div>
          <div className={styles.item}>
            <Select
              label="Tournament Impacted"
              options={eventsOptions}
              onChange={this.onTournamentChange}
              value={tournament || ''}
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
              checked={OptionsEnum[type] || OptionsEnum[1]}
            />
          </div>
        </div>
        <div className={styles.row}>
          {tournament && (
            <div className={styles.item}>
              <MultipleSearch
                label="Facilities Impacted"
                width={'282px'}
                options={facilitiesOptions}
                onChange={this.onFacilitiesChange}
                value={facilities || []}
              />
            </div>
          )}

          {facilities?.length ? (
            <div className={styles.item}>
              <MultipleSearch
                label="Fields Impacted"
                width={'282px'}
                options={fieldsOptions}
                onChange={this.onFieldsChange}
                value={fields || []}
              />
            </div>
          ) : null}

          {fields?.length
            ? this.renderTimeslots(type, timeslots, change_to, lengths)
            : null}

          {tournament && (
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
          )}
        </div>
      </div>
    );
  }
}

export default CreateBackupForm;
