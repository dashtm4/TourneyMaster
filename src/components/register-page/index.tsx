/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {
  Button,
  HeadingLevelThree,
  Radio,
  Toasts,
  HeadingLevelTwo,
  Loader,
  HeadingLevelFour,
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
import { Modal } from 'components/common';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from './header';
import Footer from 'components/footer';
import axios from 'axios';
import { IEventDetails, IRegistration } from 'common/models';
import SideBar from './side-bar';
import { getVarcharEight } from 'helpers';
import { IIndivisualsRegister, ITeamsRegister } from 'common/models/register';

enum TypeOptions {
  'Individual' = 1,
  'Team' = 2,
}

const typeOptions = ['Individual', 'Team'];

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
  const [type, setType] = React.useState(1);
  const [isOpenModalOpen, toggleModal] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const stripe = useStripe()!;
  const elements = useElements();

  const getSteps = () => {
    if (type === 1) {
      return ['Registrant Name', 'Player Info', 'Player Stats', 'Payment'];
    } else {
      return ['Team', 'Contact Info', 'Coach Info', 'Payment'];
    }
  };

  const steps = getSteps();

  useEffect(() => {
    const eventId = match.params.eventId;
    axios.get('https://api.tourneymaster.org/public/events').then(response => {
      const eventData = response.data.filter(
        (e: IEventDetails) => e.event_id === eventId
      )[0];
      setEvent(eventData);
    });

    axios
      .get('https://api.tourneymaster.org/public/registrations')
      .then(response => {
        const registrationData = response.data.filter(
          (reg: IRegistration) => reg.event_id === eventId
        )[0];
        setEventRegistration(registrationData);
      });

    axios
      .get(
        `https://api.tourneymaster.org/public/skus?product_id=evn_${eventId}`
      )
      .then(response => {
        const divs = response.data.map((sku: any) => ({
          label: sku.sku_name,
          value: sku.sku_id,
        }));

        setDivisions(divs);
      });
  }, []);

  const getPaymentIntent = (order: any) => {
    return axios.post(
      'https://api.tourneymaster.org/public/payments/create-payment-intent',
      order
    );
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
      if (type === 1) {
        url = 'https://api.tourneymaster.org/public/reg_individuals';
      } else {
        url = 'https://api.tourneymaster.org/public/reg_teams';
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
      reg_type: type === 1 ? 'individual' : 'team',
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

  const handleNext = () => {
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
    if (type === 1) {
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
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          label={
                            activeStep === steps.length - 1
                              ? 'Register'
                              : 'Next'
                          }
                        />
                      </div>
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
      <Modal isOpen={isOpenModalOpen} onClose={() => {}}>
        <div className={styles.modalContainer}>
          <div style={{ height: '190px' }}>
            <HeadingLevelFour>
              <span>Event Registration</span>
            </HeadingLevelFour>
            <p className={styles.message}>
              Do you want to register as an individual or as a team?
            </p>
            <div className={styles.radioBtnsWrapper}>
              <Radio
                options={typeOptions}
                formLabel=""
                onChange={onTypeChange}
                checked={TypeOptions[type] || ''}
              />
            </div>
            <div className={styles.btnWrapper}>
              <Button
                label="Next"
                color="primary"
                variant="contained"
                onClick={onTypeSelect}
              />
            </div>
          </div>
        </div>
      </Modal>
      <div style={{ marginTop: '50px' }}>
        <Footer />
      </div>
    </div>
  );
};

export default RegisterPage;
