/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {
  Button,
  HeadingLevelThree,
  Toasts,
  HeadingLevelTwo,
  Loader,
} from 'components/common';
import styles from './styles.module.scss';
import Paper from 'components/common/paper';
import RegistrantName from './individuals/registrant-name';
import PlayerInfo from './individuals/player-info';
import PlayerStats from './individuals/player-stats';
import Payment from './individuals/payment';
import Team from './teams/team';
import ContactInfo from './teams/contact-info';
import CoachInfo from './teams/coach-info';
import PopupRegistrationType from './popup-registration-type';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from './header';
import Footer from 'components/footer';
import axios from 'axios';
import {
  IEventDetails,
  IRegistration,
  ISelectOption,
  IUSAState,
} from 'common/models';
import SideBar from './side-bar';
import { getVarcharEight } from 'helpers';
import { IIndividualsRegister, ITeamsRegister } from 'common/models/register';
import { ButtonFormTypes } from 'common/enums';
import { eventTypeOptions } from 'components/event-details/event-structure';

axios.defaults.baseURL = process.env.REACT_APP_PUBLIC_API_BASE_URL!;

export enum TypeOptions {
  'Player' = 1,
  'Parent/Guardian' = 2,
  'Team Admin' = 3,
  'Coach' = 4,
}

const getInternalRegType = (type: TypeOptions) => {
  if (type === TypeOptions.Player || type === TypeOptions['Parent/Guardian']) {
    return 'individual';
  } else {
    return 'team';
  }
};

const getApiEndpointByRegType = (type: TypeOptions) => {
  return '/reg_' + getInternalRegType(type) + 's';
};

export interface RegisterMatchParams {
  match: {
    params: {
      eventId?: string;
    };
  };
}

const RegisterPage = ({ match }: RegisterMatchParams) => {
  const [event, setEvent] = useState<IEventDetails | null>(null);
  const [
    eventRegistration,
    setEventRegistration,
  ] = useState<IRegistration | null>(null);
  const [divisions, setDivisions] = useState([]);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [states, setStates] = useState<ISelectOption[]>([]);
  const [type, setType] = React.useState(1);
  const [isOpenModalOpen, toggleModal] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [purchasing] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  // const [clientSecret, setClientSecret] = useState<string>('');
  const stripe = useStripe()!;
  const elements = useElements();

  const getSteps = () => {
    if (
      type === TypeOptions.Player ||
      type === TypeOptions['Parent/Guardian']
    ) {
      return ['Registrant Name', 'Player Info', 'Player Stats', 'Payment'];
    } else {
      return ['Team', 'Contact Info', 'Coach Info', 'Payment'];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    const eventId = match.params.eventId;
    axios.get('/events').then(response => {
      const eventData: IEventDetails = response.data.filter(
        (e: IEventDetails) => e.event_id === eventId
      )[0];

      setEvent(eventData);
      setType(
        eventTypeOptions[eventData.event_type] === eventTypeOptions.Showcase
          ? TypeOptions.Player
          : TypeOptions['Team Admin']
      );
    });

    axios.get('/registrations').then(response => {
      const registrationData = response.data.filter(
        (reg: IRegistration) => reg.event_id === eventId
      )[0];
      setEventRegistration(registrationData);
    });

    axios.get(`/skus?product_id=evn_${eventId}`).then(response => {
      const divs = response.data.map((sku: any) => ({
        label: sku.sku_name,
        value: sku.sku_id,
      }));

      const sortedDivs = divs.sort((a: ISelectOption, b: ISelectOption) =>
        a.label.localeCompare(b.label, undefined, { numeric: true })
      );

      setDivisions(sortedDivs);
    });

    axios.get('/states').then(response => {
      const selectStateOptions = response.data.map((it: IUSAState) => ({
        label: it.state_id,
        value: it.state_name,
      }));

      const sortedSelectStateOptions = selectStateOptions.sort(
        (a: ISelectOption, b: ISelectOption) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
      );

      setStates(sortedSelectStateOptions);
    });
  }, []);

  // const getPaymentIntent = (order: any) => {
  //   return axios.post('/payments/create-payment-intent', order);
  // };

  const saveRegistrationResponse = async () => {
    const updatedRegistration: any = {
      ...registration,
      division_id:
        registration.ext_sku && registration.ext_sku.startsWith('div_')
          ? registration.ext_sku.slice(4)
          : null,
      reg_response_id: getVarcharEight(),
      registration_id: eventRegistration?.registration_id,
    };
    setRegistration(updatedRegistration);

    // if (!data.payment_method) {
    //   throw new Error('Please, specify payment method');
    // }

    try {
      await axios.post(getApiEndpointByRegType(type), updatedRegistration);
      return updatedRegistration;
    } catch (err) {
      return Toasts.errorToast(err.message);
    }
  };

  const handleProceedToPayment = async () => {
    axios
      .get(`/payment_plans?sku_id=${registration.ext_sku}`)
      .then(response => {
        const plans = response.data.map((plan: any) => ({
          label: plan.payment_plan_name,
          value: plan.payment_plan_id,
          iterations: plan.iterations,
          interval: plan.interval,
          interval_count: plan.interval_count,
          price: plan.price,
        }));
        setPaymentPlans(plans);

        const planWithMinIterations = plans.reduce((prev: any, cur: any) =>
          prev.iterations < cur.iterations ? prev : cur
        );
        setRegistration({
          ...registration,
          payment_selection: planWithMinIterations.value,
          payment_method: 'Credit Card',
        });
      });
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleNext = (evt: React.FormEvent) => {
    evt.preventDefault();

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else if (activeStep === steps.length - 2) {
      // TODO: Change step ids to constants
      handleProceedToPayment();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const [registration, setRegistration] = useState<
    Partial<IIndividualsRegister> | Partial<ITeamsRegister>
  >({});

  const onChange = (name: string, value: string | number) => {
    setRegistration(prevRegistration => ({
      ...prevRegistration,
      [name]: value,
    }));
  };

  const fillParticipantInfo = (info: any) => {
    setRegistration({ ...registration, ...info });
  };

  const fillCoachInfo = (info: any) => {
    setRegistration({ ...registration, ...info });
  };

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(Number(TypeOptions[e.target.value]));
  };

  const onTypeSelect = () => {
    toggleModal(false);
  };

  const getStepContent = (step: number) => {
    if (
      type === TypeOptions.Player ||
      type === TypeOptions['Parent/Guardian']
    ) {
      switch (step) {
        case 0:
          return <RegistrantName onChange={onChange} data={registration} />;
        case 1:
          return (
            <PlayerInfo
              onChange={onChange}
              data={registration}
              fillParticipantInfo={fillParticipantInfo}
              divisions={divisions}
              states={states}
            />
          );
        case 2:
          return <PlayerStats onChange={onChange} data={registration} />;
        default:
          return (
            <Payment
              onChange={onChange}
              data={registration}
              processing={processing}
              purchasing={purchasing}
              paymentSelectionOptions={paymentPlans}
            />
          );
      }
    } else {
      switch (step) {
        case 0:
          return (
            <Team
              onChange={onChange}
              data={registration}
              divisions={divisions}
              states={states}
            />
          );
        case 1:
          return <ContactInfo onChange={onChange} data={registration} />;
        case 2:
          return (
            <CoachInfo
              onChange={onChange}
              data={registration}
              fillCoachInfo={fillCoachInfo}
            />
          );
        default:
          return (
            <Payment
              onChange={onChange}
              data={registration}
              processing={processing}
              purchasing={purchasing}
              paymentSelectionOptions={paymentPlans}
            />
          );
      }
    }
  };

  const handleCustomerActionRequired = async ({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }: any) => {
    if (subscription && subscription.status === 'active') {
      // Subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    }

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    const paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then(result => {
          if (result.error) {
            // Start code flow to handle updating the payment details.
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc).
            throw result.error;
          } else {
            if (result.paymentIntent!.status === 'succeeded') {
              // Show a success message to your customer.
              // There's a risk of the customer closing the window before the callback.
              // We recommend setting up webhook endpoints later in this guide.
              return {
                priceId,
                subscription,
                invoice,
                paymentMethodId,
              };
            }
          }
        })
        .catch(error => {
          throw error;
          // Toasts.errorToast(error.message!);
        });
    } else {
      // No customer action needed.
      return { subscription, priceId, paymentMethodId };
    }
  };

  const handlePaymentMethodRequired = ({
    subscription,
    paymentMethodId,
    priceId,
  }: any) => {
    if (subscription.status === 'active') {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // Using localStorage to manage the state of the retry here,
      // feel free to replace with what you prefer.
      // Store the latest invoice ID and status.
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      );
      throw new Error('Your card was declined.');
    } else {
      return { subscription, priceId, paymentMethodId };
    }
  };

  const createSubscription = async (subscriptionData: any) => {
    return (
      axios
        .post('/payments/create-subscription', subscriptionData)
        // If the card is declined, display an error to the user.
        .then(result => {
          if (!result.data.success) {
            // The card had an error when trying to attach it to a customer.
            throw new Error(result.data.message);
          }
          return result.data.subscription;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the addional details we need.
        .then(result => {
          return {
            paymentMethodId: subscriptionData.paymentMethodId,
            priceId: subscriptionData.items[0].payment_plan_id,
            subscription: result,
          };
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handleCustomerActionRequired)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        .then(handlePaymentMethodRequired)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .catch(error => {
          // An error has happened. Display the failure to the user here.
          // We utilize the HTML element we created.
          throw error;
        })
    );
  };

  const onSubscriptionComplete = async (result: any) => {
    // Payment was successful.
    if (result.subscription.status === 'active') {
      // Change your UI to show a success message to your customer.
      // Call your backend to grant access to your service based on
      // `result.subscription.items.data[0].price.product` the customer subscribed to.
    }
    return result.subscription;
  };

  const handleSubmit = async () => {
    try {
      if (!stripe || !elements) {
        return Toasts.errorToast('Rats. Something went wrong. Please retry.');
      }
      setProcessing(true);

      const updatedRegistration = await saveRegistrationResponse();

      const customer = {
        name:
          updatedRegistration.registrant_first_name ||
          updatedRegistration.contact_first_name +
          ' ' +
          updatedRegistration.registrant_last_name ||
          updatedRegistration.contact_last_name,
        email:
          updatedRegistration.registrant_email ||
          updatedRegistration.contact_email,
        phone:
          updatedRegistration.registrant_mobile ||
          updatedRegistration.contact_mobile,
        address: {
          line1: '',
          line2: '',
          city:
            updatedRegistration.player_city || updatedRegistration.team_city,
          state:
            updatedRegistration.player_state || updatedRegistration.team_state,
          country: 'US',
          postal_code: '',
        },
      };

      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: customer,
      });

      let paymentMethod;
      if (result.error) {
        throw new Error(result.error.message!);
      } else {
        paymentMethod = result.paymentMethod;
      }

      const subscriptionData = {
        reg_type: getInternalRegType(type),
        reg_response_id: updatedRegistration.reg_response_id,
        registration_id: updatedRegistration.registration_id,
        customer,
        items: [
          {
            sku_id: registration.ext_sku,
            payment_plan_id: registration.payment_selection,
            quantity: 1,
          },
        ],
        paymentMethodId: paymentMethod!.id,
      };

      subscriptionData.customer.address.postal_code = paymentMethod?.billing_details.address?.postal_code!;

      await createSubscription(subscriptionData);
      Toasts.successToast(`Registration processed!`);

      setProcessing(false);
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } catch (error) {
      setProcessing(false);
      return Toasts.errorToast(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.stepperWrapper}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HeadingLevelTwo>
              {`${TypeOptions[type]} Registration`}
            </HeadingLevelTwo>
          </div>
          <div style={{ width: '90%' }}>
            <Paper>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                style={{ backgroundColor: 'transparent', width: '100%' }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>
                      <HeadingLevelThree color="#1c315f">
                        <span>{label}</span>
                      </HeadingLevelThree>
                    </StepLabel>
                    <StepContent>
                      <form onSubmit={handleNext}>
                        <div>{getStepContent(index)}</div>
                        <div className={styles.buttonsWrapper}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            label="Back"
                            variant="text"
                            color="secondary"
                          />
                          <Button
                            btnType={ButtonFormTypes.SUBMIT}
                            variant="contained"
                            disabled={processing}
                            color="primary"
                            label={
                              activeStep === steps.length - 1
                                ? 'Agree and Pay'
                                : 'Next'
                            }
                          />
                        </div>
                      </form>
                      {processing ? <Loader /> : null}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <div className={styles.section}>
                  <div className={styles.successMessage}>
                    Registration completed successfully! A confirmation email
                    has also been sent. Thanks!
                  </div>
                </div>
              )}
            </Paper>
          </div>
        </div>
        <div className={styles.sideContent}>
          {event && eventRegistration ? (
            <SideBar event={event} eventRegistration={eventRegistration} />
          ) : (
              <Loader />
            )}
        </div>
      </div>
      {event && (
        <PopupRegistrationType
          event={event}
          isOpenModalOpen={isOpenModalOpen}
          onTypeChange={onTypeChange}
          onTypeSelect={onTypeSelect}
          type={type}
        />
      )}
      <div style={{ marginTop: '50px' }}>
        <Footer />
      </div>
    </div>
  );
};

export default RegisterPage;
