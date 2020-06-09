import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration, BindingCbWithTwo } from 'common/models';
import { Checkbox, Input, Select } from 'components/common';
import PaymentSchedule from './payment-schedule';

interface IPaymentsProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
}

const installmentOptions = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
];

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
  const onNumInstallmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('num_installments', e.target.value);
    const plans = [];
    for (let i = 1; i <= +e.target.value; i++) {
      const plan = {
        id: i === 1 ? 'FP' : `${i}M`,
        name: i === 1 ? 'Pay in full' : `${i} installments`,
        type: 'installment',
        iterations: i,
        interval: 'day',
        intervalCount: '1',
      };
      plans.push(plan);
    }
    if (scheduleIsPresent) {
      plans.push(paymentSchedule);
    }
    onChange('payment_schedule_json', JSON.stringify(plans));
  };

  const onUpchargeFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('upcharge_fee', e.target.value);

  const onSalesTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('sales_tax_rate', e.target.value);

  const onPromocodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code', e.target.value);

  const onPromocodeDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code_discount', e.target.value);

  const onPaymentScheduleJsonChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange('payment_schedule_json', e.target.value);

  const onPaymentScheduleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.checked) {
      const newPaymentScheduleJson = JSON.parse(
        data?.payment_schedule_json ? data?.payment_schedule_json! : '[]'
      );
      newPaymentScheduleJson.push({
        id: 'S',
        type: 'schedule',
        name: 'Pay later',
        schedule: [{ date: new Date(), amount: 100, amountType: 'percent' }],
      });

      onChange('payment_schedule_json', JSON.stringify(newPaymentScheduleJson));
    } else {
      const newPaymentScheduleJson = JSON.parse(
        data?.payment_schedule_json ? data?.payment_schedule_json! : '[]'
      ).filter((x: any) => x.type !== 'schedule');
      onChange('payment_schedule_json', JSON.stringify(newPaymentScheduleJson));
    }
  };

  const paymentSchedule = JSON.parse(data?.payment_schedule_json!)?.find(
    (x: any) => x.type === 'schedule'
  );

  const onScheduleChange = (schedule: any) => {
    const newPaymentScheduleJson = JSON.parse(
      data?.payment_schedule_json!
    ).map((paymentOption: any) =>
      paymentOption.type === 'schedule' ? schedule : paymentOption
    );
    onChange('payment_schedule_json', JSON.stringify(newPaymentScheduleJson));
  };

  const scheduleIsPresent =
    data?.payment_schedule_json &&
    JSON.parse(data?.payment_schedule_json).find(
      (x: any) => x.type === 'schedule'
    )
      ? true
      : false;

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
            <Select
              options={installmentOptions}
              value={data ? String(data.num_installments) : ''}
              onChange={onNumInstallmentsChange}
            />
          ) : null}
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onPaymentScheduleCheckboxChange}
            options={[
              {
                label: 'Payment Schedule',
                checked: Boolean(scheduleIsPresent),
              },
            ]}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Payment Schedule"
            type="text"
            value={data ? data.payment_schedule_json : ''}
            onChange={onPaymentScheduleJsonChange}
          />
        </div>
      </div>
      <div className={styles.sectionRow}>
        {paymentSchedule ? (
          <PaymentSchedule
            schedule={paymentSchedule}
            onScheduleChange={onScheduleChange}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Payments;
