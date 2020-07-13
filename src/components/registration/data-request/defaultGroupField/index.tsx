import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { BindingCbWithTwo, ISelectOption } from 'common/models';
import { Input, Select } from 'components/common/';
import { DndItems } from 'components/divisions-and-pools/common';
import moveIcon from 'assets/moveIcon.png';
import styles from '../styles.module.scss';

interface IFieldProps {
  data: any;
  updateRequestIds: BindingCbWithTwo<any, string>;
}

enum fieldType {
  INPUT = 0,
  SELECT = 1,
}

const Field = ({ data, updateRequestIds }: IFieldProps) => {
  const [, drag] = useDrag({
    item: { type: DndItems.REGISTRANT_DATA_FIELD },
    end(_, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();

      if (!dropResult) {
        return;
      }

      updateRequestIds(data.data_field_id, 'add');
    },
  });

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
    <div ref={drag} className={styles.fieldWrapper}>
      <div className={styles.field}>{renderField(data)}</div>
      <span className={styles.iconWrapper}>
        <img
          src={moveIcon}
          style={{
            width: '21px',
            height: '21px',
            alignSelf: 'center',
          }}
          alt=""
        />
      </span>
    </div>
  );
};

export default Field;
