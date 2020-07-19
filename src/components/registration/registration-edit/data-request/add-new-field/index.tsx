import React, { useState } from 'react';
import { connect } from 'react-redux';
import api from 'api/api';
import Input from 'components/common/input';
import { Toasts, Select } from 'components/common';
import Button from 'components/common/buttons/button';
import { loadRegistrantData } from 'components/register-page/individuals/player-stats/logic/actions';

import styles from './styles.module.scss';

interface IAddNewField {
  onCancel: () => void;
  eventId: string;
  registrantDataFields?: any;
  loadRegistrantData: () => void;
}

const addButton = {
  color: 'white',
  fontSize: '16px',
  opacity: '1',
  height: '40px',
  marginTop: 'auto',
  marginLeft: '10px',
};

const type = [
  { label: 'Input', value: 'Input' },
  { label: 'Select', value: 'Select' },
];

const AddNewField = ({
  registrantDataFields,
  eventId,
  onCancel,
  loadRegistrantData,
}: IAddNewField) => {
  const [dataLabel, setDataLabel] = useState('');
  const [dataDefaults, setDataDefaults] = useState('');
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [groupByValue, setGroupByValue] = useState('User Defined');
  const [fieldType, setFieldType] = useState('Input');

  console.log(eventId);

  const onAdd = async () => {
    try {
      const structuredSelectOptions = {};
      selectOptions.map((el: any, index: number) => {
        const key = `value_${index + 1}`;
        structuredSelectOptions[key] = el;
        return true;
      });

      await api.post('/registrant_data_fields', {
        data_group: groupByValue,
        data_label: dataLabel,
        data_defaults: fieldType === 'Input' ? null : JSON.stringify([structuredSelectOptions]),
        is_active_YN: 1,
      });
    } catch {
      Toasts.errorToast('Could not add a new field.');
    }

    loadRegistrantData();
    onCancel();
  };

  const getGroupByList = () => {
    const groupByList = new Set();
    registrantDataFields.map((el: any) => {
      groupByList.add(el.data_group);
      return true;
    });
    const options: any = [];

    groupByList.forEach((el) => {
      options.push({
        label: el,
        value: el,
      });
    });

    return options;
  };

  const onDataLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataLabel(e.target.value);
  };

  const onDataDefaultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataDefaults(e.target.value);
  };

  const onChangeGroupBy = (e: any) => {
    setGroupByValue(e.target.value);
  };

  const onChangeFieldType = (e: any) => {
    setFieldType(e.target.value);
  };

  const onAddSelectItem = () => {
    setSelectOptions([...selectOptions, dataDefaults]);
  };

  console.log('> fieldType', fieldType);
  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>Add a New Field</div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div className={styles.sectionItem}>
            <Select
              onChange={onChangeGroupBy}
              name={'Data Group'}
              options={getGroupByList()}
              value={groupByValue}
              label="Data Group"
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="Label Name"
              isRequired={true}
              value={dataLabel}
              onChange={onDataLabelChange}
            />
          </div>
        </div>
        <div className={styles.sectionItem}>
          <div className={styles.sectionItem}>
            <Select
              onChange={onChangeFieldType}
              name="Type"
              options={type}
              value={fieldType}
              label="Type"
            />
          </div>
          <div className={styles.addSelectItem}>
            <Input
              fullWidth={true}
              label="Add Select Options"
              isRequired={true}
              value={dataDefaults}
              onChange={onDataDefaultsChange}
            />
            <Button
              label="+"
              variant="contained"
              color="secondary"
              onClick={onAddSelectItem}
              btnStyles={addButton}
            />
          </div>
          <div className={styles.selectItems}>
            {selectOptions.map((el: string, index: number) => (
              <div key={index}>{el}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.buttonsGroup}>
        <Button
          label="Cancel"
          variant="text"
          color="secondary"
          onClick={onCancel}
        />
        <Button
          label="Add"
          variant="contained"
          color="primary"
          onClick={onAdd}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: {
  playerStatsReducer: { registrantDataFields: any };
}) => ({
  registrantDataFields: state.playerStatsReducer.registrantDataFields,
});

const mapDispatchToProps = {
  loadRegistrantData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewField);
