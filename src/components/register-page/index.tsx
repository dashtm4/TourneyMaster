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
import { IIndivisualsRegister, ITeamsRegister } from 'common/models/register';
import { ButtonFormTypes } from 'common/enums';
import { eventTypeOptions } from 'components/event-details/event-structure';

axios.defaults.baseURL =
  process.env.REACT_APP_PUBLIC_API_BASE_URL ||
  'https://api.tourneymaster.org/public'; // TODO: Remove the hardcoded link when everyone is ok

export enum TypeOptions {
  'Player' = 1,
  'Parent/Guardian' = 2,
  'Team Admin' = 3,
  'Coach' = 4,
}

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
  const [states, setStates] = useState<ISelectOption[]>([]);
  const [type, setType] = React.useState(1);
  const [isOpenModalOpen, toggleModal] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
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

  const getPaymentIntent = (order: any) => {
    return axios.post('/payments/create-payment-intent', order);
  };

  const saveRegistrationResponse = async () => {
    const updatedRegistration: any = {
      ...registration,
      reg_response_id: getVarcharEight(),
      registration_id: eventRegistration?.registration_id,
    };
    setRegistration(updatedRegistration);

    // if (!data.payment_method) {
    //   throw new Error('Please, specify payment method');
    // }

    try {
      let url;
      if (
        type === TypeOptions.Player ||
        type === TypeOptions['Parent/Guardian']
      ) {
        url = '/reg_individuals';
      } else {
        url = '/reg_teams';
      }

      await axios.post(url, updatedRegistration);
      return updatedRegistration;
    } catch (err) {
      return Toasts.errorToast(err.message);
    }
  };

  const handleProceedToPayment = async () => {
    setProcessing(true);
    setActiveStep(prevActiveStep => prevActiveStep + 1);

    const updatedRegistration = await saveRegistrationResponse();

    const order = {
      reg_type: TypeOptions[type],
      reg_response_id: updatedRegistration.reg_response_id,
      registration_id: updatedRegistration.registration_id,
      order: {
        email:
          updatedRegistration.registrant_email ||
          updatedRegistration.contact_email,
        items: [{ sku_id: updatedRegistration.ext_sku, quantity: 1 }],
      },
    };

    // if (!clientSecret || !amountDue) {
    const data = await getPaymentIntent(order);

    if (data.data.success!) {
      setClientSecret(data.data.clientSecret);
      // setStripeOrder(data.data.order);
      const updatedAmountDue = +data.data.order.amount / 100;
      onChange('payment_amount', updatedAmountDue);
      onChange('payment_selection', 'Full');
      onChange('payment_method', 'Credit Card');

      setPurchasing(true);
      setProcessing(false);
    } else {
      setProcessing(false);
      setActiveStep(prevActiveStep => prevActiveStep - 1);

      Toasts.errorToast(data.data.message!);
    }
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
    Partial<IIndivisualsRegister> | Partial<ITeamsRegister>
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
            />
          );
      }
    }
  };

  const handleSubmit = async () => {
    try {
      // setProcessing(true);
      if (!stripe || !elements) {
        return Toasts.errorToast('Rats. Something went wrong. Please retry.');
      }

      // setProcessing(true);

      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            // name: ev.target; // ev.target.name.value,
          },
        },
      });

      if (payload.error) {
        throw new Error(`Payment failed ${payload.error.message}`);
      } else {
        setProcessing(false);
        Toasts.successToast('Registration is successfully saved!');
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    } catch (e) {
      setProcessing(false);
      return Toasts.errorToast(e.message);
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
                            color="primary"
                            label={
                              activeStep === steps.length - 1
                                ? 'Register'
                                : 'Next'
                            }
                          />
                        </div>
                      </form>
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
