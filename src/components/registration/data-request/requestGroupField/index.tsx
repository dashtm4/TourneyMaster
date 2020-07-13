import React, { useState } from 'react';
import {
  BindingCbWithTwo,
  BindingCbWithThree,
  ISelectOption,
} from 'common/models';
import { Icons } from 'common/enums';
import { getIcon } from 'helpers';
import { Input, Select } from 'components/common/';
import styles from '../styles.module.scss';

interface IRequestGroupFieldProps {
  data: any;
  updateRequestIds: BindingCbWithTwo<any, string>;
  updateOptions: BindingCbWithThree<number | string, number, boolean>;
}

enum defaultOptions {
  REQUIRED = 1,
  REQUESTED = 2,
  NONE = 0,
}

enum fieldType {
  INPUT = 0,
  SELECT = 1,
}

const CLOSE_ICON_STYLES = {
  marginBottom: '4px',
  marginLeft: '6px',
};

const RequestGroupField = ({
  data,
  updateRequestIds,
  updateOptions,
}: IRequestGroupFieldProps) => {
  const requiredOptions = [
    { label: 'Required', value: defaultOptions.REQUIRED },
    { label: 'Requested', value: defaultOptions.REQUESTED },
    { label: 'None', value: defaultOptions.NONE },
  ];

  const [value, setValue] = useState(data.is_default_YN);

  const checkFieldType = (value: string | null) => {
    try {
      if (!value) {
        return { type: fieldType.INPUT, value };
      }

      const parsedArray = JSON.parse(value);
      if (Array.isArray(parsedArray) && parsedArray.length === 1) {
        const parsedObject = parsedArray[0];

        const options = Object.entries(parsedObject).map(el => ({
          value: el[0],
          label: el[1],
        }));
        return {
          type: fieldType.SELECT,
          value: options,
        };
      }
      return { type: fieldType.INPUT, value };
    } catch {
      return { type: fieldType.INPUT, value };
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setValue(value);
    if (Number(value) === data.is_default_YN) {
      updateOptions(data.data_field_id, data.is_default_YN, false);
    } else {
      updateOptions(data.data_field_id, Number(value), true);
    }
  };

  const removeRequestId = () => {
    updateRequestIds(data.data_field_id, 'remove');
  };

  const renderField = (field: {
    data_defaults: string | null;
    data_label?: string;
  }) => {
    const { value, type } = checkFieldType(field.data_defaults);
    const label = field.data_label;

    if (type === fieldType.INPUT) {
      return <Input fullWidth={true} label={label} value={value?.toString()} />;
    } else {
      const selectValue = (value as ISelectOption[])[0].value.toString();

      return (
        <Select
          options={value as ISelectOption[]}
          label={label}
          value={selectValue}
        />
      );
    }
  };

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.field}>{renderField(data)}</div>
      <div className={styles.selectWrapper}>
        <Select options={requiredOptions} value={value} onChange={onChange} />
      </div>
      <div onClick={removeRequestId} className={styles.closeIcon}>
        {getIcon(Icons.CLOSE, CLOSE_ICON_STYLES)}
      </div>
    </div>
  );
};

export default RequestGroupField;
