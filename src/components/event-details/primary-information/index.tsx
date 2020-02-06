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
  timeZoneOptions: string[];
  onChange: any;
}

const sportOptions = ['Lacrosse', 'Football', 'Baseball'];

const PrimaryInformationSection: React.FC<Props> = ({
  eventData,
  genderOptions,
  timeZoneOptions,
  onChange,
}: Props) => {
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('event_name', e.target.value);

  const onTagChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('event_tag', e.target.value);

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
            value={sportOptions[0]}
            onChange={onChange}
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
            onChange={onChange}
          />
          <DatePicker
            width="161px"
            label="End Date"
            type="date"
            value={eventData.event_enddate}
            onChange={onChange}
          />
          <Select
            width="256px"
            options={timeZoneOptions}
            label="Time Zone"
            value={timeZoneOptions[0]}
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
