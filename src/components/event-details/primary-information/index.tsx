import React from 'react';
import CodeIcon from '@material-ui/icons/Code';

import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Select,
  Button,
  DatePicker,
} from 'components/common';

import styles from '../styles.module.scss';
import { EventDetailsDTO } from '../logic/model';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  eventData: Partial<EventDetailsDTO>;
  onChange: any;
}

enum sportsEnum {
  'Lacrosse' = 1,
  'Field Hockey' = 2,
}

enum timeZoneEnum {
  'Eastern Standard Time' = -5,
  'Central Standard Time' = -6,
  'Mountain Standard Time' = -7,
  'Pacific Standard Time' = -8,
}

const sportOptions = ['Lacrosse', 'Field Hockey'];
const timeZoneOptions = [
  'Eastern Standard Time',
  'Central Standard Time',
  'Mountain Standard Time',
  'Pacific Standard Time',
];
const genderOptions = ['Male', 'Female'];
enum genderEnum {
  'Male' = 1,
  'Female' = 2,
}

const PrimaryInformationSection: React.FC<Props> = ({
  eventData,
  onChange,
}: Props) => {
  const { time_zone_utc, sport_id, event_startdate, event_enddate } = eventData;

  const onNameChange = (e: InputTargetValue) =>
    onChange('event_name', e.target.value);

  const onTagChange = (e: InputTargetValue) =>
    onChange('event_tag', e.target.value);

  const onSportChange = (e: InputTargetValue) =>
    onChange('sport_id', sportsEnum[e.target.value]);

  const onGenderChange = (e: InputTargetValue) =>
    onChange('gender_id', genderEnum[e.target.value]);

  const onStartDate = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('event_startdate', new Date(e).toISOString());

  const onEndDate = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('event_enddate', new Date(e).toISOString());

  const onTimeZone = (e: InputTargetValue) =>
    onChange('time_zone_utc', timeZoneEnum[e.target.value]);

  const onDescriptionChange = (e: InputTargetValue) =>
    onChange('event_description', e.target.value);

  const onPrimaryLocation = (e: InputTargetValue) =>
    onChange('primary_location_desc', e.target.value);

  return (
    <SectionDropdown type="section" padding="0" isDefaultExpanded={true}>
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Primary Information</span>
      </HeadingLevelThree>
      <div className={styles.piDetails}>
        <div className={styles.piDetailsFirst}>
          <Input
            // width="256px"
            fullWidth={true}
            label="Event Name"
            value={eventData.event_name || ''}
            onChange={onNameChange}
          />
          <Input
            // width="161px"
            fullWidth={true}
            label="Event Tag"
            value={eventData.event_tag || ''}
            onChange={onTagChange}
          />
          <Select
            // width="161px"
            options={sportOptions}
            label="Sport"
            value={sport_id ? sportsEnum[sport_id!] : ''}
            onChange={onSportChange}
          />
          <Select
            // width="160px"
            options={genderOptions}
            label="Gender"
            value={genderOptions[0]}
            onChange={onGenderChange}
          />
        </div>
        <div className={styles.piDetailsSecond}>
          <DatePicker
            // width="160px"
            label="Start Date"
            type="date"
            value={event_startdate}
            onChange={onStartDate}
          />
          <DatePicker
            // width="161px"
            label="End Date"
            type="date"
            value={event_enddate}
            onChange={onEndDate}
          />
          <Select
            // width="256px"
            options={timeZoneOptions}
            label="Time Zone"
            value={time_zone_utc ? timeZoneEnum[time_zone_utc!] : ''}
            onChange={onTimeZone}
          />
        </div>
        <div className={styles.piDetailsThird}>
          <Input
            // width="635px"
            label="General Location"
            placeholder="Search google maps"
            value={eventData.primary_location_desc}
            onChange={onPrimaryLocation}
          />
        </div>
        <div className={styles.piDetailsThirdArea}>
          <Input
            // width="635px"
            fullWidth={true}
            label="Description"
            multiline={true}
            rows="4"
            value={eventData.event_description}
            onChange={onDescriptionChange}
          />
          <div className={styles.embedBtn}>
            <Button
              label="Embed Code"
              icon={<CodeIcon />}
              color="secondary"
              variant="text"
            />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default PrimaryInformationSection;
