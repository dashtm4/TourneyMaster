import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration } from 'common/models/registration';
import { Checkbox } from 'components/common';
import moment from 'moment';

const Payments = ({ data }: { data: Partial<IRegistration> }) => {
  let paymentSchedule = null;
  if (data?.payment_schedule_json) {
    const decodedSchedule = JSON.parse(data?.payment_schedule_json!).find(
      (x: any) => x.type === 'schedule'
    );
    if (decodedSchedule?.schedule) {
      paymentSchedule =
        'Payment Schedule: ' +
        decodedSchedule.schedule
          .map(
            (x: any) => `${moment(x.date).format('YYYY-MM-DD')}: ${x.amount}%`
          )
          .join(', ');
    }
  }
  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <div>
            <span className={styles.sectionTitle}>Accept Payments</span>
            <p>{data.payments_enabled_YN ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className={styles.sectionItem}>
          {data?.upcharge_fees_on_registrations ? (
            <div>
              <span className={styles.sectionTitle}>
                Upcharge Processing Fees
              </span>
              <p>{data.upcharge_fee ? `${data.upcharge_fee}%` : '—'}</p>
            </div>
          ) : (
            <Checkbox
              options={[
                {
                  label: 'Upcharge Processing Fees',
                  checked: Boolean(
                    data ? data.upcharge_fees_on_registrations : false
                  ),
                  disabled: true,
                },
              ]}
            />
          )}
        </div>
        <div className={styles.sectionItem}>
          {data?.include_sales_tax_YN ? (
            <div>
              <span className={styles.sectionTitle}>Sales Tax Rate</span>
              <p>{data.sales_tax_rate ? `${data.sales_tax_rate}%` : '—'}</p>
            </div>
          ) : (
            <Checkbox
              options={[
                {
                  label: 'Include Sales Tax',
                  checked: Boolean(data ? data.include_sales_tax_YN : false),
                  disabled: true,
                },
              ]}
            />
          )}
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.sectionTitle}>Promo Code</span>
          <p>{data.promo_code ? data.promo_code : '—'}</p>
          {data.promo_code ? (
            <div>
              <span className={styles.sectionTitle}>Promo Code Discount</span>
              <p>
                {data.promo_code_discount
                  ? `${data.promo_code_discount}%`
                  : '—'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          {data?.installment_payments_YN ? (
            <div>
              <span className={styles.sectionTitle}>
                Monthly Installment Payments
              </span>
              <p>{data.num_installments ? `${data.num_installments}` : '—'}</p>
            </div>
          ) : (
            <Checkbox
              options={[
                {
                  label: 'Monthly Installment Payments',
                  checked: Boolean(data ? data.installment_payments_YN : false),
                  disabled: true,
                },
              ]}
            />
          )}
        </div>
        <div className={styles.sectionItem}>
          <span className={styles.sectionTitle}>{paymentSchedule}</span>
        </div>
      </div>
    </div>
  );
};

export default Payments;
