import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import { Checkbox, Input } from 'components/common';

import styles from '../../styles.module.scss';
import 'react-quill/dist/quill.snow.css';
import { IWelcomeSettings, BindingCbWithOne } from 'common/models';
import PhoneInput from 'react-phone-input-2';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface IEmailReceiptsProps {
  data: IWelcomeSettings;
  onChange: BindingCbWithOne<IWelcomeSettings>;
};

const EmailReceipts = ({ data, onChange }: IEmailReceiptsProps) => {
 
  const [isAdditionalInstructions, setIsAdditionalInstructions] = useState(0);

  const updateData = (key: string, value: any) => {
    if (Object.keys(data.contactPerson).includes(key)) {
      data.contactPerson[key] = value;
    } else {
      data[key] = value;
    }
    onChange(data);
  };

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
    updateData('from', e.target.value);
  };

  const onSubjectFieldChange = (e: InputTargetValue) => {
    updateData('subject', e.target.value);
  };

  const onIncludeEventLogo = (e: InputTargetValue) => {
    updateData('includeEventLogo', e.target.checked ? 1 : 0);
  };

  const onIncludeCancellationPolicy = (e: InputTargetValue) => {
    updateData('includeCancellationPolicy', e.target.checked ? 1 : 0);
  };

  const onBodyChange = (text: string) => {
    updateData('body', text);
  };

  const onAdditionalInstructionsChange = (e: InputTargetValue) => {
    setIsAdditionalInstructions(e.target.checked ? 1 : 0);
  };

  const onReplyToFieldChange = (e: InputTargetValue) => {
    updateData('replyTo', e.target.value);
  };

  const onContactNameFieldChange = (e: InputTargetValue) => {
    updateData('contactName', e.target.value);
  };

  const onContactEmailFieldChange = (e: InputTargetValue) => {
    updateData('contactEmail', e.target.value);
  };

  const onContactPhoneNumberChange = (phoneNumber: string) => {
    updateData('contactPhoneNumber', phoneNumber);
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
              value={data.from || ''}
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
              value={data.replyTo || ''}
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
              value={data.subject || ''}
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
              value={data.contactPerson.contactName || ''}
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
              value={data.contactPerson.contactEmail || ''}
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
              value={data.contactPerson.contactPhoneNumber || ''}
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
                checked: Boolean(data && data.includeCancellationPolicy),
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
                checked: Boolean(data && data.includeEventLogo),
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
          value={data.body || ''}
          modules={quill}
          formats={formats}
          onChange={onBodyChange}
        />
      </div>
    </div>
  );
};

export default EmailReceipts;