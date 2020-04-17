import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Button,
  HeadingLevelTwo,
  Radio,
  Input,
  Select,
} from 'components/common';
import styles from './styles.module.scss';
import history from 'browserhistory';
import { getData, sendMessage } from '../logic/actions';
import { BindingAction, BindingCbWithOne, IEventDetails } from 'common/models';
import Filter from './filter';
import { IScheduleFilter } from './filter';
import { applyFilters, mapFilterValues, mapTeamsByFilter } from '../helpers';

export interface IMessage {
  type: string;
  title: string;
  message: string;
  recipients: any[];
}

interface Props {
  sendMessage: BindingCbWithOne<IMessage>;
  getData: BindingAction;
  events: any;
  divisions: any;
  pools: any;
  teams: any;
  fields: any;
}

const CreateMessage = ({
  getData,
  sendMessage,
  events,
  divisions,
  pools,
  teams,
}: Props) => {
  useEffect(() => {
    getData();
  }, []);

  const [data, setMessage] = useState<IMessage>({
    type: 'Text',
    title: '',
    message: '',
    recipients: [''],
  });

  const eventOptions = events.length
    ? events.map((event: IEventDetails) => ({
        label: event.event_name,
        value: event.event_id,
      }))
    : [];

  const typeOptions = ['Text', 'Email'];
  const recipientOptions = ['One', 'Many'];

  const [event, setEvent] = useState();

  const [recipientType, setRecipientType] = useState('One');

  const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
    applyFilters({ divisions, pools, teams })
  );

  useEffect(() => {
    changeFilterValues(applyFilters({ divisions, pools, teams }, event));
  }, [event]);

  const onCancelClick = () => {
    history.push('/event-link');
  };

  const onTypeChange = (e: any) => {
    setMessage({ ...data, recipients: [''], type: e.target.value });
  };

  const onTitleChange = (e: any) => {
    setMessage({ ...data, title: e.target.value });
  };

  const onContentChange = (e: any) => {
    setMessage({ ...data, message: e.target.value });
  };

  const onEventSelect = (e: any) => {
    setEvent(e.target.value);
  };

  const onRecipientTypeChange = (e: any) => {
    setRecipientType(e.target.value);
  };

  const onRecipientChange = (e: any) => {
    setMessage({ ...data, recipients: [e.target.value] });
  };

  const onSend = () => {
    if (recipientType === 'Many') {
      const recipients = mapTeamsByFilter([...teams], filterValues, data.type);
      setMessage({ ...data, recipients });
      sendMessage({ ...data, recipients });
    } else {
      sendMessage(data);
    }
  };

  const onFilterChange = (data: IScheduleFilter) => {
    const newData = mapFilterValues({ teams, pools }, data);
    changeFilterValues({ ...newData });
  };

  const renderOneRecipientInput = () => {
    return (
      <div className={styles.recipientWrapper}>
        <span className={styles.title}>
          {data.type === 'Text' ? 'Number:' : 'Email:'}{' '}
        </span>
        <Input
          width="250px"
          placeholder={
            data.type === 'Text' ? '+11234567890' : 'example@example.com'
          }
          onChange={onRecipientChange}
          value={data.recipients[0] || ''}
        />
        <span className={styles.additionalInfo}>
          {data.type === 'Text' &&
            'Format: [+][country code][subscriber number including area code]'}
        </span>
      </div>
    );
  };

  const renderRecipientFilter = () => {
    return (
      <div className={styles.recipientsFilterWrapper}>
        <div className={styles.selectContainer}>
          <Select
            label="Event"
            width={'168px'}
            options={eventOptions}
            onChange={onEventSelect}
            value={event || ''}
          />
        </div>
        {event && (
          <Filter
            filterValues={filterValues}
            onChangeFilterValue={onFilterChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Paper sticky={true}>
        <div className={styles.btnsWrapper}>
          <Button
            color="secondary"
            variant="text"
            onClick={onCancelClick}
            label="Cancel"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={onSend}
            label="Send"
          />
        </div>
      </Paper>
      <HeadingLevelTwo margin="24px 0">New Message</HeadingLevelTwo>
      <div className={styles.btnsGroup}>
        <Radio
          options={typeOptions}
          formLabel="Type"
          onChange={onTypeChange}
          checked={data.type}
        />
        <Radio
          options={recipientOptions}
          formLabel="Recipient"
          onChange={onRecipientTypeChange}
          checked={recipientType}
        />
      </div>
      <div className={styles.recipientsWrapper}>
        {recipientType === 'One'
          ? renderOneRecipientInput()
          : renderRecipientFilter()}
      </div>
      <div className={styles.inputGroup}>
        <div>
          {data.type === 'Email' && (
            <Input
              label="Title"
              fullWidth={true}
              onChange={onTitleChange}
              value={data.title}
            />
          )}
          <Input
            label="Message"
            placeholder=""
            multiline={true}
            rows="10"
            onChange={onContentChange}
            value={data.message}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    events: state.eventLink.data.events,
    divisions: state.eventLink.data.divisions,
    pools: state.eventLink.data.pools,
    fields: state.eventLink.data.fields,
    teams: state.eventLink.data.teams,
  };
};

const mapDispatchToProps = {
  getData,
  sendMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage);
