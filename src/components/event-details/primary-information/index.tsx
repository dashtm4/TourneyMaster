/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import {
  SectionDropdown,
  HeadingLevelThree,
  Input,
  Select,
  DatePicker,
  CardMessage,
  ButtonCopy,
} from 'components/common';
import { CardMessageTypes } from 'components/common/card-message/types';

import { IPosition } from './map/autocomplete';
import {
  EventMenuTitles,
  ButtonColors,
  ButtonVariant,
  EventStatuses,
} from 'common/enums';

import styles from '../styles.module.scss';

import Map from './map';
import PlacesAutocompleteInput from './map/autocomplete';
import { IEventDetails } from 'common/models';
import { getIdByGenderAndSport, getGenderAndSportById } from './helper';
import { timeToDate, dateToTime } from 'helpers';

const CONTACT_TOOLTIP_MESSAGE =
  'Contact details; included when printing the Master Schedule and Fields-by-Field details';
const RESULTS_DISABLE_MESSAGE =
  'Link will be available after the publication of the event';

const BASE_RESULT_LINK = 'http://results.tourneymaster.com/event/';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  eventData: Partial<IEventDetails>;
  onChange: (name: string, value: string | number, ignore?: boolean) => void;
  isSectionExpand: boolean;
}

enum sportsEnum {
  'Lacrosse' = 1,
  'Field Hockey' = 2,
  'Basketball' = 3,
  'Soccer' = 4,
}
enum genderEnum {
  'Male' = 1,
  'Female' = 2,
  'Co-Ed' = 3,
}
enum timeZoneEnum {
  'Eastern Standard Time' = -5,
  'Central Standard Time' = -6,
  'Mountain Standard Time' = -7,
  'Pacific Standard Time' = -8,
}

const sportOptions = [
  { label: 'Lacrosse', value: sportsEnum[1] },
  { label: 'Field Hockey', value: sportsEnum[2] },
  { label: 'Basketball', value: sportsEnum[3] },
  { label: 'Soccer', value: sportsEnum[4] },
];
const timeZoneOptions = [
  'Eastern Standard Time',
  'Central Standard Time',
  'Mountain Standard Time',
  'Pacific Standard Time',
];
const genderOptions = [
  { label: 'Male', value: genderEnum[1] },
  { label: 'Female', value: genderEnum[2] },
  { label: 'Co-Ed', value: genderEnum[3] },
];

const levelOptions = ['High School', 'Club', 'Youth', 'Other'];

const PrimaryInformationSection: React.FC<Props> = ({
  eventData,
  onChange,
  isSectionExpand,
}: Props) => {
  const {
    event_id,
    time_zone_utc,
    event_startdate,
    event_enddate,
    first_game_time,
    last_game_end,
    event_level,
    is_published_YN,
  } = eventData;

  const {
    sportId: dropdownSportValue,
    genderId: dropdownGenderValue,
  } = getGenderAndSportById(eventData.sport_id);

  const [genderId, onChangeGender] = useState(dropdownGenderValue);
  const [sportId, onChangeSport] = useState(dropdownSportValue);

  useEffect(() => {
    const calculatedSportId = getIdByGenderAndSport(genderId, sportId);
    onChange('sport_id', calculatedSportId, true);
  }, [genderId, sportId]);

  const onNameChange = (e: InputTargetValue) =>
    onChange('event_name', e.target.value);

  const onTagChange = (e: InputTargetValue) =>
    onChange('event_tag', e.target.value);

  const onSportChange = (e: InputTargetValue) => {
    onChangeSport(sportsEnum[e.target.value]);
  };
  const onLevelChange = (e: InputTargetValue) =>
    onChange('event_level', e.target.value);

  const onGenderChange = (e: InputTargetValue) => {
    onChangeGender(genderEnum[e.target.value]);
  };

  const onStartDate = (e: Date | string) => {
    if (!isNaN(Number(e))) {
      onChange('event_startdate', new Date(e).toISOString());
      if (event_enddate && new Date(e).toISOString() > event_enddate) {
        onEndDate(e);
      }
    }
  };

  const onEndDate = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('event_enddate', new Date(e).toISOString());

  const onFirstGameTime = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('first_game_time', dateToTime(e));

  const onLastGameTime = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('last_game_end', dateToTime(e));

  const onTimeZone = (e: InputTargetValue) =>
    onChange('time_zone_utc', timeZoneEnum[e.target.value]);

  const onDescriptionChange = (e: InputTargetValue) =>
    onChange('event_description', e.target.value);

  const onPrimaryLocation = (address: string) => {
    onChange('primary_location_desc', address);
  };

  const onGeneralLocationSelect = ({
    position,
    state,
    city,
  }: {
    position: IPosition;
    state: string;
    city: string;
  }) => {
    onChange('primary_location_lat', position.lat);
    onChange('primary_location_long', position.lng);
    onChange('primary_location_state', state);
    onChange('primary_location_city', city);
  };

  const onMainContactChange = (e: InputTargetValue) =>
    onChange('main_contact', e.target.value);

  const onMainContactMobieChange = (e: InputTargetValue) =>
    onChange('main_contact_mobile', e.target.value);

  const onMainContactEmailChange = (e: InputTargetValue) =>
    onChange('main_contact_email', e.target.value);

  const { primary_location_lat: lat, primary_location_long: lng } = eventData;

  return (
    <SectionDropdown
      id={EventMenuTitles.PRIMARY_INFORMATION}
      type="section"
      panelDetailsType="flat"
      useBorder={true}
      expanded={isSectionExpand}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Primary Information</span>
      </HeadingLevelThree>
      <div className={styles.piDetails}>
        <div className={styles.piDetailsFirst}>
          <Input
            fullWidth={true}
            label="Event Name"
            value={eventData.event_name || ''}
            onChange={onNameChange}
            autofocus={eventData.event_name ? false : true}
          />
          <Input
            fullWidth={true}
            label="Event Tag"
            startAdornment="@"
            value={eventData.event_tag || ''}
            onChange={onTagChange}
          />
          <Select
            options={sportOptions}
            label="Sport"
            value={sportsEnum[dropdownSportValue]}
            onChange={onSportChange}
          />
          <Select
            options={levelOptions.map(type => ({ label: type, value: type }))}
            label="Level"
            value={event_level || levelOptions[3]}
            onChange={onLevelChange}
          />
          <Select
            options={genderOptions}
            label="Gender"
            value={genderEnum[dropdownGenderValue]}
            onChange={onGenderChange}
          />
        </div>
        <div className={styles.piDetailsFirstContacts}>
          <Input
            fullWidth={true}
            label="Main Contact Name"
            value={eventData.main_contact || ''}
            onChange={onMainContactChange}
          />
          <Input
            fullWidth={true}
            label="Main Contact Mobile"
            value={eventData.main_contact_mobile || ''}
            onChange={onMainContactMobieChange}
          />
          <div className={styles.emailSectionItem}>
            <span className={styles.label}>Main Contact Email</span>
            <ValidatorForm onSubmit={() => { }}>
              <TextValidator
                value={eventData.main_contact_email || ''}
                onChange={onMainContactEmailChange}
                name="email"
                validators={['isEmail']}
                errorMessages={['email is not valid']}
              />
            </ValidatorForm>
          </div>
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            {CONTACT_TOOLTIP_MESSAGE}
          </CardMessage>
        </div>
        <div className={styles.piSectionContainer}>
          <div className={styles.piSection}>
            <div className={styles.piDetailsSecond}>
              <DatePicker
                minWidth="100%"
                label="Start Date"
                type="date"
                value={event_startdate}
                onChange={onStartDate}
              />
              <DatePicker
                minWidth="100%"
                label="End Date"
                type="date"
                value={event_enddate}
                onChange={onEndDate}
              />
            </div>
            <div className={styles.gameTimesWrapper}>
              <DatePicker
                minWidth="100%"
                label="First Game Start"
                type="time"
                value={timeToDate(first_game_time!)}
                onChange={onFirstGameTime}
              />
              <DatePicker
                minWidth="100%"
                label="Last Game End"
                type="time"
                value={timeToDate(last_game_end!)}
                onChange={onLastGameTime}
              />
              <Select
                options={timeZoneOptions.map(type => ({
                  label: type,
                  value: type,
                }))}
                label="Time Zone"
                value={time_zone_utc ? timeZoneEnum[time_zone_utc!] : ''}
                onChange={onTimeZone}
              />
            </div>
            <div className={styles.piDetailsThird}>
              <PlacesAutocompleteInput
                onSelect={onGeneralLocationSelect}
                onChange={onPrimaryLocation}
                address={eventData.primary_location_desc || ''}
                label={'General Location'}
              />
            </div>
            <div className={styles.piDetailsThirdArea}>
              <Input
                fullWidth={true}
                label="Event Description *"
                multiline={true}
                rows="4"
                value={eventData.event_description}
                onChange={onDescriptionChange}
              />
            </div>
          </div>
          <div className={styles.mapContainer}>
            <Map
              position={{
                lat: lat || 39.521305,
                lng: lng || -76.6451518,
              }}
            />
          </div>
        </div>
        <ButtonCopy
          copyString={`${BASE_RESULT_LINK}${event_id}`}
          color={ButtonColors.SECONDARY}
          variant={ButtonVariant.TEXT}
          disableMessage={
            is_published_YN === EventStatuses.Draft
              ? RESULTS_DISABLE_MESSAGE
              : undefined
          }
          label="Results Link"
        />
      </div>
    </SectionDropdown>
  );
};

export default PrimaryInformationSection;
