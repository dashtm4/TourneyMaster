import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Paper,
  Button,
  HeadingLevelTwo,
  Radio,
  Input,
  // DatePicker,
  // Select,
} from 'components/common';
import styles from './styles.module.scss';
import history from 'browserhistory';
import { getData } from '../logic/actions';
import { BindingAction } from 'common/models';
import AWS from 'aws-sdk';
// import Filter from 'components/common/table-schedule/components/filter';
// import { IScheduleFilter } from 'components/common/table-schedule/types';
// import { applyFilters, mapFilterValues } from '../helpers';
import { Toasts } from 'components/common';

interface IMessage {
  type: string;
  title: string;
  content: string;
  recipients: any[];
}

interface Props {
  getData: BindingAction;
  events: any;
  divisions: any;
  pools: any;
  teams: any;
  fields: any;
}

const CreateMessage = ({
  getData,
}: // events,
// divisions,
// pools,
// teams,
// fields,
Props) => {
  useEffect(() => {
    getData();
  }, []);

  const [message, setMessage] = useState<IMessage>({
    type: 'Text',
    title: '',
    content: '',
    recipients: [''],
  });

  const typeOptions = ['Text', 'Email'];
  // const deliveryOptions = ['Send Now', 'Schedule'];

  // const [delivery, setDelivery] = useState(deliveryOptions[0]);

  // const [event, setEvent] = useState();

  // const [filterValues, changeFilterValues] = useState<IScheduleFilter>(
  //   applyFilters({ divisions, pools, teams, fields })
  // );

  // useEffect(() => {
  //   changeFilterValues(
  //     applyFilters({ divisions, pools, teams, fields }, event)
  //   );
  // }, [event]);

  const onCancelClick = () => {
    history.push('/event-link');
  };

  const onTypeChange = (e: any) => {
    setMessage({ ...message, recipients: [''], type: e.target.value });
  };

  const onTitleChange = (e: any) => {
    setMessage({ ...message, title: e.target.value });
  };

  const onContentChange = (e: any) => {
    setMessage({ ...message, content: e.target.value });
  };

  // const onDeliveryChange = (e: any) => {
  //   setDelivery(e.target.value);
  // };

  // const onDeliveryDateChange = () => {};

  // const onEventSelect = (e: any) => {
  //   setEvent(e.target.value);
  // };

  // const eventOptions = events.length
  //   ? events.map((event: IEventDetails) => ({
  //       label: event.event_name,
  //       value: event.event_id,
  //     }))
  //   : [];

  // const onSave = () => {};

  const onEmailSend = async (
    title: string,
    messageContent: string,
    emailAdresses: string[]
  ) => {
    const credentials = {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID!,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY!,
    };
    AWS.config.update({
      credentials,
      region: process.env.REACT_APP_AWS_REGION,
    });

    try {
      const params = {
        Destination: {
          CcAddresses: [],
          ToAddresses: emailAdresses,
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: messageContent,
            },
            Text: {
              Charset: 'UTF-8',
              Data: messageContent,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: title || 'TourneyMaster',
          },
        },
        Source: 'rostyslav.khanas@binary-studio.com',
        ReplyToAddresses: [],
      };

      const sendEmailResponse = await new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise();
      console.log(
        `Message is successfully send. MessageId: ${sendEmailResponse.MessageId}`
      );
      if (sendEmailResponse.MessageId) {
        Toasts.successToast('Email is successfully sent.');
      }
    } catch (e) {
      Toasts.errorToast("Couldn't send an email.");
    }
  };

  const onSmsSend = async (messageContent: string, phoneNumbers: string[]) => {
    const credentials = {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID!,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY!,
    };
    AWS.config.update({
      credentials,
      region: process.env.REACT_APP_AWS_REGION,
    });

    // const topicArn =
    //   'arn:aws:sns:us-east-1:564748484972:TourneyMasterEventLink';

    try {
      const params = {
        Message: messageContent,
        PhoneNumber: phoneNumbers[0],
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'Tourney',
          },
        },
      };

      const publishTextResponse = await new AWS.SNS({
        apiVersion: '2010-03-31',
      })
        .publish(params)
        .promise();

      if (publishTextResponse) {
        Toasts.successToast('Message is successfully sent.');
      }
    } catch (e) {
      Toasts.errorToast("Couldn't send a text.");
    }
  };

  const onRecipientChange = (e: any) => {
    setMessage({ ...message, recipients: [e.target.value] });
  };

  const onSend = () => {
    if (message.type === 'Text') {
      onSmsSend(message.content, message.recipients);
    } else if (message.type === 'Email') {
      onEmailSend(message.title, message.content, message.recipients);
    }
    setMessage({
      type: 'Text',
      title: '',
      content: '',
      recipients: [''],
    });
  };

  // const onFilterChange = (data: IScheduleFilter) => {
  //   const newData = mapFilterValues({ teams, pools }, data);
  //   changeFilterValues({ ...newData });
  // };

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
          {/* <Button
            color="secondary"
            variant="text"
            onClick={onSave}
            label="Save"
          /> */}
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
          checked={message.type}
        />
        {/* <Radio
          options={deliveryOptions}
          formLabel="Delivery"
          onChange={onDeliveryChange}
          checked={delivery}
        />
        {delivery === 'Schedule' && (
          <DatePicker
            width="257px"
            label="Schedule Date &amp; Time"
            type="date-time"
            viewType="input"
            value={new Date().toISOString()}
            onChange={onDeliveryDateChange}
          />
        )} */}
      </div>
      <div
        className={styles.recipientsCheckboxWrapper}
        style={{ marginTop: '15px' }}
      >
        <div className={styles.title}>
          Recipient:{' '}
          <Input
            width="250px"
            placeholder={
              message.type === 'Text' ? '+11234567890' : 'example@example.com'
            }
            onChange={onRecipientChange}
            value={message.recipients[0]}
          />
          <span className={styles.additionalInfo}>
            {message.type === 'Text' &&
              'Format: [+][country code][subscriber number including area code]'}
          </span>
        </div>
        {/* <Select
            options={eventOptions}
            placeholder="Select Event"
            onChange={onEventSelect}
            value={event || ''}
          /> */}
      </div>
      <div className={styles.inputGroup}>
        <div style={{ marginTop: '15px' }}>
          {message.type === 'Email' && (
            <Input
              label="Title"
              fullWidth={true}
              onChange={onTitleChange}
              value={message.title}
            />
          )}
          <div style={{ marginTop: '15px' }}>
            <Input
              label="Message"
              placeholder=""
              multiline={true}
              rows="10"
              onChange={onContentChange}
              value={message.content}
            />
          </div>
        </div>
      </div>
      {/* <Filter
        days={2}
        filterValues={filterValues}
        onChangeFilterValue={onFilterChange}
      /> */}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage);
