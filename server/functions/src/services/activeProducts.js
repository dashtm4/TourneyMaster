import axios from './axios.js';
import dateFormat from 'dateformat';

export const getActiveProducts = async () => {
  return axios.get('/products').then(data => {
    return data.data;
  });
};

export const getActiveSkus = async () => {
  return axios.get('/skus').then(data => {
    return data.data;
  });
};

export const getPaymentPlans = async ({
  product_id = null,
  sku_id = null,
  payment_plan_id = null,
}) => {
  let query =
    '?' +
    (product_id !== null ? `product_id=${product_id}` : '') +
    (sku_id !== null ? `&sku_id=${sku_id}` : '');
  console.log(`sku_id: ${sku_id}, payment_plan_id: ${payment_plan_id}`);

  const skus = await axios.get(`/skus${query}`);
  console.log(`Query: ${query}, Skus: ${skus}`);
  if (skus.data?.length > 0) {
    const paymentPlans = skus.data.flatMap(sku => {
      sku.payment_schedule_json = JSON.parse(sku.payment_schedule_json);

      let paymentPlans = [];
      if (
        Array.isArray(sku.payment_schedule_json) &&
        sku.payment_schedule_json.length > 0
      ) {
        paymentPlans = sku.payment_schedule_json
          .map(rawPaymentPlan => {
            if (rawPaymentPlan.type === 'installment') {
              const installmentPrice =
                Math.round((+sku.price / +rawPaymentPlan.iterations) * 100) /
                100;
              const recurringPayments =
                +rawPaymentPlan.iterations > 1
                  ? `$${installmentPrice.toFixed(
                    2
                  )} for ${+rawPaymentPlan.iterations} times every${
                  +rawPaymentPlan.intervalCount > 1
                    ? +' ' + rawPaymentPlan.intervalCount
                    : ''
                  } ${rawPaymentPlan.interval}${
                  +rawPaymentPlan.intervalCount > 1 ? 's' : ''
                  } for `
                  : '';
              const { payment_schedule_json, ...paymentPlan } = {
                ...sku,
                price: installmentPrice,
                total_price: installmentPrice * rawPaymentPlan.iterations,
                discount: 0,
                payment_plan_id: sku.sku_id + '_' + rawPaymentPlan.id,
                payment_plan_name: rawPaymentPlan.name,
                payment_plan_notice: `The Installment Schedule is:  ${recurringPayments}the total amount of $${(
                  installmentPrice * rawPaymentPlan.iterations
                ).toFixed(2)}`,
                type: rawPaymentPlan.type,
                iterations: rawPaymentPlan.iterations,
                interval: rawPaymentPlan.interval,
                intervalCount: rawPaymentPlan.intervalCount,
              };
              return paymentPlan;
            } else if (rawPaymentPlan.type === 'schedule') {
              const schedule = {};
              for (let phase of rawPaymentPlan.schedule) {
                const amount =
                  phase.amountType === 'fixed'
                    ? +phase.amount
                    : phase.amountType === 'percent'
                      ? Math.round(+sku.price * +phase.amount) / 100
                      : null;
                if (!amount) {
                  throw new Error('Incorrect amount specified.');
                }
                const date = new Date(phase.date);
                const now = new Date(
                  new Date()
                    .toLocaleString('us-GB', { timeZone: 'America/New_York' })
                    .split(',')[0]
                );
                if (date <= now) {
                  if (!schedule['now']) schedule['now'] = 0;
                  schedule['now'] += amount;
                } else {
                  const formattedDate = dateFormat(date, 'yyyy-mm-dd');
                  if (!schedule[formattedDate]) schedule[formattedDate] = 0;
                  schedule[formattedDate] += amount;
                }
              }

              const scheduleArr = Object.entries(schedule).map(
                ([date, amount]) => ({
                  date,
                  amount,
                  price_external_id:
                    sku.sku_id +
                    '_' +
                    rawPaymentPlan.id +
                    '_' +
                    (date === 'now' ? 'now' : dateFormat(date, 'yyyymmdd')) +
                    '_' +
                    amount,
                })
              );

              const { payment_schedule_json, ...paymentPlan } = {
                ...sku,
                total_price: sku.price,
                discount: 0,
                payment_plan_id: sku.sku_id + '_' + rawPaymentPlan.id,
                payment_plan_name: rawPaymentPlan.name,
                payment_plan_notice: `You will be charged ${scheduleArr
                  .map(x => `${x.date}: $${x.amount.toFixed(2)}`)
                  .join(', ')}`,
                type: rawPaymentPlan.type,
                schedule: scheduleArr,
              };
              return paymentPlan;
            } else {
              throw new Error(
                `Unknown payment plan type ${rawPaymentPlan.type}`
              );
            }
          })
          .filter(x => x);
      }
      // If no payment schedule specified (likely a front end bug) still allow to pay in full
      if (!paymentPlans || paymentPlans.length === 0) {
        const { payment_schedule_json, ...paymentPlan } = {
          ...sku,
          total_price: sku.price,
          payment_plan_id: sku.sku_id + '_FP',
          payment_plan_name: 'Pay in full',
          payment_plan_notice: `Your credit card will be charged $${sku.price.toFixed(
            2
          )} now.`,
          type: 'installment',
          discount: 0,
          iterations: 1,
          interval: 'month',
          intervalCount: 1,
        };
        return paymentPlan;
      } else {
        return paymentPlans;
      }
    });
    if (payment_plan_id) {
      return paymentPlans.filter(p => p.payment_plan_id === payment_plan_id);
    } else {
      return paymentPlans;
    }
  } else {
    return null;
  }
};
