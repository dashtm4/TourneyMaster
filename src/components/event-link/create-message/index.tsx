import React from 'react';
import {
  Paper,
  Button,
  HeadingLevelTwo,
  Radio,
  Checkbox,
  Input,
} from 'components/common';
import styles from './styles.module.scss';
import history from 'browserhistory';

const CreateMessage = () => {
  const onCancelClick = () => {
    history.push('/event-link');
  };

  const typeOptions = [
    { label: 'Push', checked: true },
    { label: 'Text', checked: false },
    { label: 'Email', checked: false },
  ];
  const deliveryOptions = ['Send Now', 'Schedule'];
  const recipientsOption = [
    { label: 'All', checked: true },
    { label: 'By Division', checked: false },
    { label: 'By Pool', checked: false },
    { label: 'By Team', checked: false },
    { label: 'By Field', checked: false },
    { label: 'By Game Time', checked: false },
  ];

  const onTypeChange = () => {};

  const onDeliveryChange = () => {};

  const onRecipientsChange = () => {};
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
            color="secondary"
            variant="text"
            onClick={() => {}}
            label="Save"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={() => {}}
            label="Send"
          />
        </div>
      </Paper>
      <HeadingLevelTwo margin="24px 0">New Message</HeadingLevelTwo>
      <div className={styles.btnsGroup}>
        <Checkbox
          options={typeOptions}
          formLabel="Type"
          onChange={onTypeChange}
        />
        <Radio
          options={deliveryOptions}
          formLabel="Delivery"
          onChange={onDeliveryChange}
          checked="Send Now"
        />
      </div>
      <div className={styles.inputGroup}>
        <div>
          <Input fullWidth={true} placeholder="Title" />
          <Input
            fullWidth={true}
            placeholder="Message"
            multiline={true}
            rows="10"
          />
        </div>
        <div className={styles.recipientsCheckboxWrapper}>
          <Checkbox
            options={recipientsOption}
            formLabel="Recipients"
            onChange={onRecipientsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMessage;
