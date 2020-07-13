import React, { useState } from 'react';
import api from 'api/api';
import history from 'browserhistory';
import Input from 'components/common/input';
import { Toasts } from 'components/common';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';

interface IAddNewField {
  onCancel: () => void;
  eventId: string;
}

const AddNewField = ({ eventId, onCancel }: IAddNewField) => {
  const [dataGroup, setDataGroup] = useState('');
  const [dataLabel, setDataLabel] = useState('');
  const [dataDefaults, setDataDefaults] = useState('');

  const onAdd = async () => {
    try {
      await api.post('/registrant_data_fields', {
        data_group: dataGroup,
        data_label: dataLabel,
        data_defaults: JSON.stringify(dataDefaults),
        is_active_YN: 1,
      });
    } catch {
      Toasts.errorToast('Could not add a new field.');
    }
    onCancel();
    history.push(`/event/event-details/${eventId}/`);
  };

  const onDataGroupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataGroup(e.target.value);
  };

  const onDataLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataLabel(e.target.value);
  };

  const onDataDefaultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataDefaults(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionTitle}>Add a New Field</div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="Group Name"
              isRequired={true}
              value={dataGroup}
              onChange={onDataGroupChange}
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
            <Input
              fullWidth={true}
              label="Add Select Options"
              isRequired={true}
              value={dataDefaults}
              onChange={onDataDefaultsChange}
            />
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

export default AddNewField;
