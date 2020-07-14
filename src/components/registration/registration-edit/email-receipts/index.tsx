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
 
  const [isAdditionalInstructions, setIsAdditionalInstructions] = useState(0);

  const request = (data && data.welcome_email_settings && data.welcome_email_settings !== null ? JSON.parse(data.welcome_email_settings) : {
    from: '',
    replyTo: '',
    subject: '',
    contactPerson: '',
    includeCancellationPolicy: 0,
    includeEventLogo: 0,
    body: '',
  });
  const [contactName, setContactName] = useState(request ? request.contactPerson.substring(0, request.contactPerson.indexOf(' (')) : '');
  const [contactEmail, setContactEmail] = useState(request ? request.contactPerson.substring(request.contactPerson.indexOf('(') + 1, request.contactPerson.indexOf(',')) : '');
  const [contactPhoneNumber, setContactPhoneNumber] = useState(request ? request.contactPerson.substring(request.contactPerson.indexOf('+') + 1, request.contactPerson.indexOf(')')) : '');

  const updateRequest = (key: string, value: any) => {
    request[key] = value;
    onChange('welcome_email_settings', JSON.stringify(request));
  };

  const toJoinContactInfo = () => {
    if (contactName === '' || contactEmail === '' || contactPhoneNumber === '') {
      return;
    }
    updateRequest('contactPerson', `${contactName} (${contactEmail}, +${contactPhoneNumber})`);
  };

  useEffect(() => {
    toJoinContactInfo();
  }, [contactName, contactEmail, contactPhoneNumber]);

  

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

  const onFromFieldChange = (e: InputTargetValue) => {
    updateRequest('from', e.target.value);
  };

  const onSubjectFieldChange = (e: InputTargetValue) => {
    updateRequest('subject', e.target.value);
  };

  const onIncludeEventLogo = (e: InputTargetValue) => {
    updateRequest('includeEventLogo', e.target.checked ? 1 : 0);
  };

  const onIncludeCancellationPolicy = (e: InputTargetValue) => {
    updateRequest('includeCancellationPolicy', e.target.checked ? 1 : 0);
  };

  const onBodyChange = (text: string) => {
    updateRequest('body', text);
  };

  const onAdditionalInstructionsChange = (e: InputTargetValue) => {
    setIsAdditionalInstructions(e.target.checked ? 1 : 0);
  };

  const onReplyToFieldChange = (e: InputTargetValue) => {
    updateRequest('replyTo', e.target.value);
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
          <h3>Email Sender Settings</h3>
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
              // disableDropdown
              onlyCountries={['us','ca']}
              disableCountryCode={false}
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
                label: 'Additional Instructions:',
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
                label: 'Cancellation Policy:',
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
                label: 'Event logo: ',
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