import React from 'react';
import { Input, Checkbox, Button } from 'components/common';
import { IField } from '../../../../common/models';
import styles from './styles.module.scss';
import { IInputEvent } from 'common/types';
import { ButtonVarian, ButtonColors, ButtonTypes } from 'common/enums';

interface Props {
  field: IField;
  fieldNumber: number;
  isEdit: boolean;
  onChangeField: (field: IField) => void;
}

enum FormFields {
  FIELD_NAME = 'field_name',
  IS_ILLUMINATED_YN = 'is_illuminated_YN',
  IS_PREMIER_YN = 'is_premier_YN',
}

const Field = ({ field, fieldNumber, isEdit, onChangeField }: Props) => {
  const FIELD_OPTIONS = [
    {
      label: 'Illuminated',
      checked: Boolean(field.is_illuminated_YN),
      name: FormFields.IS_ILLUMINATED_YN,
      disabled: !isEdit,
    },
    {
      label: 'Premier Location',
      checked: Boolean(field.is_premier_YN),
      name: FormFields.IS_PREMIER_YN,
      disabled: !isEdit,
    },
  ];

  const onChange = ({
    target: { name, value, type, checked },
  }: IInputEvent) => {
    const updetedField = {
      ...field,
      [name]: type === 'checkbox' ? +checked : value,
    };

    onChangeField(updetedField);
  };

  return (
    <fieldset className={styles.field}>
      <legend className={styles.fieldTitleWrapper}>
        <span>Field {fieldNumber} Name</span>
        <Button
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          type={ButtonTypes.DANGER_LINK}
          label="Delete"
        />
      </legend>
      <Input
        onChange={onChange}
        value={field.field_name || ''}
        name={FormFields.FIELD_NAME}
        width="250px"
        placeholder={`Field ${fieldNumber}`}
        disabled={!isEdit}
      />
      <Checkbox onChange={onChange} options={FIELD_OPTIONS} />
    </fieldset>
  );
};

export default Field;
