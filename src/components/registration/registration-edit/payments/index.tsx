import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration, BindingCbWithTwo } from 'common/models';
import { Checkbox, Input } from 'components/common';

interface IPaymentsProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
}

const Payments = ({ data, onChange }: IPaymentsProps) => {
  const onUpchargeProcessingFeesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange('upcharge_fees_on_registrations', Number(e.target.checked));

  const onPaymentsEnabledYNChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('payments_enabled_YN', Number(e.target.checked));

  const onIncludeSalesTaxYNChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('include_sales_tax_YN', Number(e.target.checked));

  const onInstallmentPaymentsYNChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange('installment_payments_YN', Number(e.target.checked));
    if (!e.target.checked) {
      onChange('num_installments', 1);
    }
  };
  const onNumInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('num_installments', e.target.value);

  const onUpchargeFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('upcharge_fee', e.target.value);

  const onSalesTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('sales_tax_rate', e.target.value);

  const onPromocodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code', e.target.value);

  const onPromocodeDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code_discount', e.target.value);

  const onCheckAcceptedChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('checks_accepted_YN', Number(e.target.checked));

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onPaymentsEnabledYNChange}
            options={[
              {
                label: 'Accept Payments',
                checked: Boolean(data ? data.payments_enabled_YN : false),
              },
            ]}
          />
        </div>

        <div
          className={styles.sectionItem}
          style={{ flexGrow: 1, maxWidth: '30%' }}
        >
          <Checkbox
            onChange={onUpchargeProcessingFeesChange}
            options={[
              {
                label: 'Upcharge Processing Fees',
                checked: Boolean(
                  data ? data.upcharge_fees_on_registrations : false
                ),
              },
            ]}
          />
          {data?.upcharge_fees_on_registrations ? (
            <Input
              fullWidth={true}
              startAdornment="%"
              type="number"
              value={data ? data.upcharge_fee : ''}
              onChange={onUpchargeFeeChange}
            />
          ) : null}
        </div>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onIncludeSalesTaxYNChange}
            options={[
              {
                label: 'Include Sales Tax',
                checked: Boolean(data ? data.include_sales_tax_YN : false),
              },
            ]}
          />
          {data?.include_sales_tax_YN ? (
            <Input
              fullWidth={true}
              startAdornment="%"
              type="number"
              value={data ? data.sales_tax_rate : ''}
              onChange={onSalesTaxRateChange}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div
          className={styles.sectionItem}
          style={{ flexGrow: 1, maxWidth: '30%' }}
        >
          <Checkbox
            onChange={onInstallmentPaymentsYNChange}
            options={[
              {
                label: 'Installment Payments',
                checked: Boolean(data ? data.installment_payments_YN : false),
              },
            ]}
          />
          {data?.installment_payments_YN ? (
            <Input
              fullWidth={true}
              type="number"
              value={data ? data.num_installments : ''}
              onChange={onNumInstallmentsChange}
            />
          ) : null}
        </div>

        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onCheckAcceptedChange}
            options={[
              {
                label: 'Checks Accepted',
                checked: Boolean(data ? data.checks_accepted_YN : false),
              },
            ]}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Promo Code"
            value={data ? data.promo_code : ''}
            onChange={onPromocodeChange}
          />
          {data?.promo_code ? (
            <Input
              fullWidth={true}
              startAdornment="%"
              label="Promo Code Discount"
              type="number"
              value={data ? data.promo_code_discount : ''}
              onChange={onPromocodeDiscountChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Payments;
