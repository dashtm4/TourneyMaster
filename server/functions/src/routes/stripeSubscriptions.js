import config from '../config.js';
import Stripe from 'stripe';
import { getPaymentPlans } from '../services/activeProducts.js';
const stripe = Stripe(config.STRIPE_API_SECRET_KEY);

const createOrUpdateCustomer = async subData => {
  const customerData = {
    ...subData.customer,
    metadata: {
      reg_type: subData.reg_type,
      reg_response_id: subData.reg_response_id,
    },
  };
  console.log(customerData);

  let customer;
  const customers = await stripe.customers.list({
    email: customerData.email,
    limit: 1,
  });
  if (customers.data.length === 0) {
    customer = await stripe.customers.create(customerData);
    console.log(`Stripe Customer ${customer.id} created`);
  } else {
    customer = await stripe.customers.update(
      customers.data[0].id,
      customerData
    );
    console.log(`Stripe Customer ${customer.id} updated`);
  }

  return customer;
};

const attachPaymentMethod = async (customer, paymentMethodId) => {
  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customer.id,
  });

  console.log(
    `Stripe PaymentMethod ${paymentMethod.id} attached to customer ${customer.id}`
  );

  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  console.log(
    `Stripe PaymentMethod ${paymentMethod.id} set as default customer`
  );
  return paymentMethod;
};

const validateSubscriptionData = async (subData /* price */) => {
  if (subData.reg_type !== 'individual' && subData.reg_type !== 'team') {
    throw new Error('Reg_type must be "individual" or "team"');
  }
};

const createSubscription = async (customer, paymentPlan, subData) => {
  const validatePrice = async price => {
    if (price.unit_amount > process.env.MAX_PAYMENT_AMOUNT * 100) {
      console.error(
        `Payment amount ${price.unit_amount /
          100} is higher than MAX_PAYMENT_AMOUNT=${
          process.env.MAX_PAYMENT_AMOUNT
        }`
      );
      throw new Error(
        `Payment amount ${price.unit_amount /
          100} cannot be processed online. Please contact the event organizer.`
      );
    }
  };

  const getPrice = async ({ sku_id, payment_plan_id }) => {
    const prices = (await stripe.prices.list({ product: sku_id, active: true }))
      .data;
    console.log(prices);
    const price = prices.find(x => x.metadata.externalId === payment_plan_id);
    console.log(price);
    await validatePrice(price);

    return price;
  };

  const salesTaxRate = paymentPlan.sales_tax_rate
    ? (
        await stripe.taxRates.list({
          active: true,
          limit: 100,
        })
      ).data.find(tax => +tax.percentage === paymentPlan.sales_tax_rate)
    : null;

  let phases = [];
  if (paymentPlan.type === 'installment') {
    const price = await getPrice(paymentPlan);

    phases.push({
      plans: [{ price: price.id, quantity: subData.items[0].quantity }],
      iterations: paymentPlan.iterations,
      proration_behavior: 'none',
      default_tax_rates: salesTaxRate ? [salesTaxRate.id] : [],
    });
  } else if (paymentPlan.type === 'schedule') {
    phases = paymentPlan.schedule;

    phases = await Promise.all(
      phases.map(async (phase, i) => {
        const price = await getPrice({
          sku_id: paymentPlan.sku_id,
          payment_plan_id: phase.price_external_id,
        });

        const t = {
          plans: [
            { price: process.env.STRIPE_PAYMENT_SCHEDULE_PRICE, quantity: 0 },
          ],
          add_invoice_items: [
            {
              price: price.id,
              quantity: subData.items[0].quantity,
            },
          ],
          billing_thresholds: {
            amount_gte: 50,
            reset_billing_cycle_anchor: false,
          },
          end_date: Math.round(
            i < phases.length - 1
              ? +phases[i + 1].date // end_date = start_date of the next installment
              : phase.date === 'now'
              ? new Date().getTime() / 1000 + 60 * 60 * 24 // if the last and only installment end_date = now + 1 day
              : +phase.date + 60 * 60 * 24 // if the last installment end_date = phase.date + 1 day
          ),
          proration_behavior: 'none',
          default_tax_rates: salesTaxRate ? [salesTaxRate.id] : [],
        };
        return t;
      })
    );
    console.log();
  }

  const subscriptionScheduleData = {
    customer: customer.id,
    start_date: 'now',
    end_behavior: 'cancel',
    phases,
    metadata: {
      reg_type: subData.reg_type,
      reg_response_id: subData.reg_response_id,
      owner_id: paymentPlan.owner_id,
      event_id: paymentPlan.event_id,
      division_id: paymentPlan.division_id,
      sku_id: paymentPlan.sku_id,
      payment_plan_id: paymentPlan.payment_plan_id,
    },
    expand: ['subscription.latest_invoice.payment_intent'],
  };

  const schedule = await stripe.subscriptionSchedules.create(
    subscriptionScheduleData
  );

  console.log(`Stripe Schedule ${schedule.id} created`);

  let subscription = await stripe.subscriptions.update(
    schedule.subscription.id,
    {
      metadata: { ...subscriptionScheduleData.metadata },
    }
  );

  console.log(`Stripe Subscription ${subscription.id} added metadata`);

  const invoice = await stripe.invoices.pay(
    schedule.subscription.latest_invoice.id
  );

  console.log(`Invoice ${invoice.id} attempted payment`);

  subscription = await stripe.subscriptions.retrieve(subscription.id, {
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription;
};

export const processCreateSubscription = async subData => {
  console.log(subData);

  const paymentPlan = (await getPaymentPlans(subData.items[0]))[0];
  // const price = await getPrice(subData);
  await validateSubscriptionData(subData /*, price */);
  const customer = await createOrUpdateCustomer(subData);
  const paymentMethod = await attachPaymentMethod(
    customer,
    subData.paymentMethodId
  );

  const subscription = await createSubscription(
    customer,
    paymentPlan,
    subData /*, price */
  );

  return subscription;
};