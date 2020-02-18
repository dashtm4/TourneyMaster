import React from 'react';
import styles from '../styles.module.scss';
import { Input, DatePicker } from 'components/common';

const PrimaryInformation = ({ data, onChange }: any) => {
  const onOpenDateChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('registration_start', new Date(e).toISOString());

  const onCloseDateChange = (e: Date | string) =>
    !isNaN(Number(e)) &&
    onChange('registration_end', new Date(e).toISOString());

  const onEntryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('entry_fee', e.target.value);

  const onDepositFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('entry_deposit', e.target.value);

  const onEarlyBirdDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('early_discount', e.target.value);

  const onDiscountEndDateChange = (e: Date | string) =>
    !isNaN(Number(e)) && onChange('discount_end', new Date(e).toISOString());

  return (
    <div className={styles.section}>
      <div className={styles.sectionFirstRow}>
        <div className={styles.sectionItem}>
          <p className={styles.sectionLabel}>Division</p>
          <span className={styles.divisionLink}>{data.division || ''}</span>
        </div>
        <div className={styles.sectionItem} />
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Open Date"
            type="date"
            // value={data.registration_start || new Date()}
            onChange={onOpenDateChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Close Date"
            type="date"
            // value={data.registration_end || new Date()}
            onChange={onCloseDateChange}
          />
        </div>
      </div>
      <div className={styles.sectionSecondRow}>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Entry Fee"
            startAdornment="$"
            type="number"
            // value={data.entry_fee || ''}
            onChange={onEntryFeeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Deposit Fee"
            startAdornment="$"
            type="number"
            // value={data.entry_deposit || ''}
            onChange={onDepositFeeChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Early Bird Discount"
            type="number"
            // value={data.early_discount || ''}
            onChange={onEarlyBirdDiscountChange}
          />
        </div>
        <div className={styles.sectionItem}>
          <DatePicker
            fullWidth={true}
            label="Discount End Date"
            type="date"
            // value={data.discount_end || new Date()}
            onChange={onDiscountEndDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryInformation;
