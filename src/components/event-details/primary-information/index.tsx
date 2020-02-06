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

interface Props {
  eventData: Partial<EventDetailsDTO>;
  genderOptions: string[];
  onChange: any;
}

enum sportsEnum {
  'Lacrosse' = 1,
  'Football' = 2,
  'Baseball' = 3,
}

enum timeZoneEnum {
  'Eastern Standart Time' = -5,
  'Another Time' = -4,
}

const sportOptions = ['Lacrosse', 'Football', 'Baseball'];
const timeZoneOptions = ['Eastern Standart Time', 'Another Time'];

const PrimaryInformationSection: React.FC<Props> = ({
  eventData,
  genderOptions,
  onChange,
}: Props) => {
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('event_name', e.target.value);

  const onTagChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('event_tag', e.target.value);

  const onSportChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('sport_id', sportsEnum[e.target.value]);

  const onStartDate = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('event_startdate', new Date(e).toISOString());

  const onEndDate = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('event_enddate', new Date(e).toISOString());

  const onTimeZone = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('time_zone_utc', timeZoneEnum[e.target.value]);

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('event_description', e.target.value);

  return (
    <SectionDropdown type="section" padding="0">
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Primary Information</span>
      </HeadingLevelThree>
      <div className={styles['pi-details']}>
        <div className={styles['pi-details-first']}>
          <Input
            width="256px"
            fullWidth={true}
            label="Event Name"
            value={eventData.event_name || ''}
            onChange={onNameChange}
          />
          <Input
            width="161px"
            fullWidth={true}
            label="Event Tag"
            value={eventData.event_tag || ''}
            onChange={onTagChange}
          />
          <Select
            width="161px"
            options={sportOptions}
            label="Sport"
            value={sportsEnum[eventData.sport_id ?? 1]}
            onChange={onSportChange}
          />
          <Select
            width="160px"
            options={genderOptions}
            label="Gender"
            value={genderOptions[0]}
          />
        </div>
        <div className={styles['pi-details-second']}>
          <DatePicker
            width="160px"
            label="Start Date"
            type="date"
            value={eventData.event_startdate}
            onChange={onStartDate}
          />
          <DatePicker
            width="161px"
            label="End Date"
            type="date"
            value={eventData.event_enddate}
            onChange={onEndDate}
          />
          <Select
            width="256px"
            options={timeZoneOptions}
            label="Time Zone"
            value={timeZoneEnum[eventData.time_zone_utc ?? -5]}
            onChange={onTimeZone}
          />
        </div>
        <div className={styles['pi-details-third']}>
          <Input
            width="635px"
            label="General Location"
            placeholder="Search google maps"
          />
          <div className={styles['pi-details-third-area']}>
            <Input
              width="635px"
              label="Description"
              multiline={true}
              rows="4"
              value={eventData.event_description}
              onChange={onDescriptionChange}
            />
            <div style={{ width: 164 }}>
              <Button
                label="Embed Code"
                icon={<CodeIcon />}
                color="secondary"
                variant="text"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default PrimaryInformationSection;
