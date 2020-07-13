import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';

import { Checkbox, Input } from 'components/common';

import styles from '../../styles.module.scss';
import 'react-quill/dist/quill.snow.css';
import { IRegistration, BindingCbWithTwo, IWelcomeSettings } from 'common/models';
import PhoneInput from 'react-phone-input-2';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IEmailReceiptsProps {
  data: IRegistration | undefined;
  onChange: BindingCbWithTwo<string, string | number | IWelcomeSettings>;
}


const EmailReceipts = ({ data, onChange }: IEmailReceiptsProps) => {
  const request = (data && data.welcome_email_settings && data.welcome_email_settings !== null ? JSON.parse(data.welcome_email_settings) : {
    from: '',
    replyTo: '',
    subject: '',
    contactPerson: '',
    includeCancellationPolicy: 0,
    includeEventLogo: 0,
    body: '',
  });
  const [isAdditionalInstructions, setIsAdditionalInstructions] = useState(0);

  const currentData = data && data.welcome_email_settings ? JSON.parse(data.welcome_email_settings) : null;

  const [contactName, setContactName] = useState(currentData ? currentData.contactPerson.substring(0, currentData.contactPerson.indexOf(' (')) : '');
  const [contactEmail, setContactEmail] = useState(currentData ? currentData.contactPerson.substring(currentData.contactPerson.indexOf('(') + 1, currentData.contactPerson.indexOf(',')) : '');
  const [contactPhoneNumber, setContactPhoneNumber] = useState(currentData ? currentData.contactPerson.substring(currentData.contactPerson.indexOf('+') + 1, currentData.contactPerson.indexOf(')')) : '');

  useEffect(() => {
    toJoinContactInfo();
  }, [contactName, contactPhoneNumber, contactEmail]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const quill = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
  };

  const toJoinContactInfo = () => {
    if (contactName === '' || contactEmail === '' || contactPhoneNumber === '') {
      return;
    }
    request.contactPerson = `${contactName} (${contactEmail}, +${contactPhoneNumber})`;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onFromFieldChange = (e: InputTargetValue) => {
    request.from = e.target.value;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onSubjectFieldChange = (e: InputTargetValue) => {
    request.subject = e.target.value;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onIncludeEventLogo = (e: InputTargetValue) => {
    request.includeEventLogo = e.target.checked ? 1 : 0;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onIncludeCancellationPolicy = (e: InputTargetValue) => {
    request.includeCancellationPolicy = e.target.checked ? 1 : 0;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onBodyChange = (text: string) => {
    request.body = text;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onAdditionalInstructionsChange = (e: InputTargetValue) => {
    setIsAdditionalInstructions(e.target.checked ? 1 : 0);
  };

  const onReplyToFieldChange = (e: InputTargetValue) => {
    request.replyTo = e.target.value;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const onContactNameFieldChange = (e: InputTargetValue) => {
    setContactName(e.target.value);
  };

  const onContactEmailFieldChange = (e: InputTargetValue) => {
    setContactEmail(e.target.value);
  };

  const onContactPhoneNumberChange = (phoneNumber: string) => {
    setContactPhoneNumber(phoneNumber);
  };

  return (
    <div className={styles.section}>

      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <h3>Main Info</h3>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div className={styles.emailReceiptsElement}>
            <Input
              label='From:'
              placeholder='Enter your name'
              value={request.from || ''}
              onChange={onFromFieldChange}
              isRequired={true}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.emailReceiptsElement}>
            <Input
              label='Reply to:'
              placeholder='Enter email to reply you'
              value={request.replyTo || ''}
              onChange={onReplyToFieldChange}
              isRequired={true}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.emailReceiptsElement}>
            <Input
              label='Subject:'
              placeholder='Enter title event'
              value={request.subject || ''}
              onChange={onSubjectFieldChange}
              isRequired={true}
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <h3>Contact for Refunds/Concerns</h3>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div className={styles.emailReceiptsElement}>
            <Input
              label='Full name'
              placeholder='Enter full name'
              value={contactName || ''}
              onChange={onContactNameFieldChange}
              isRequired={true}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.emailReceiptsElement}>
            <Input
              label='Email'
              placeholder='Enter email'
              value={contactEmail || ''}
              onChange={onContactEmailFieldChange}
              isRequired={true}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionTitle}>Phone Number</div>
          <div className={styles.emailReceiptsElement}>
            <PhoneInput
              country={'us'}
              disableDropdown
              onlyCountries={['us']}
              disableCountryCode={true}
              placeholder=""
              value={contactPhoneNumber || ''}
              onChange={onContactPhoneNumberChange}
              containerStyle={{ marginTop: '7px' }}
              inputStyle={{
                height: '40px',
                fontSize: '18px',
                color: '#6a6a6a',
                borderRadius: '4px',
                width: '100%',
              }}
              inputProps={{
                required: true,
                minLength: 14,
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div>
            <Checkbox
              options={[{
                label: 'Additional Instructions',
                checked: Boolean(isAdditionalInstructions),
              }]}
              onChange={onAdditionalInstructionsChange}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div>
            <Checkbox
              options={[{
                label: 'Cancellation Policy',
                checked: Boolean(request && request.includeCancellationPolicy),
              }]}
              onChange={onIncludeCancellationPolicy}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div>
            <Checkbox
              options={[{
                label: 'Event logo ',
                checked: Boolean(request && request.includeEventLogo),
              }]}
              onChange={onIncludeEventLogo}
            />
          </div>
        </div>
      </div>

      <div className={isAdditionalInstructions === 1 ? styles.emailReceiptWrapperEditor : styles.hiddenBlock}>
        <ReactQuill
          className={styles.emailReceiptsEditor}
          theme={'snow'}
          value={request.body || ''}
          modules={quill}
          formats={formats}
          onChange={onBodyChange}
        />
      </div>
    </div>
  );
};

export default EmailReceipts;