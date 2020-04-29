import React, { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {
  Button,
  HeadingLevelThree,
  Radio,
  HeadingLevelTwo,
  Toasts,
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

enum TypeOptions {
  'Individual' = 1,
  'Team' = 2,
}

const typeOptions = ['Individual', 'Team'];

const RegisterPage = () => {
  const [type, setType] = React.useState(1);
  const [isOpenModalOpen, toggleModal] = React.useState(true);

  const getSteps = () => {
    if (type === 1) {
      return ['Registrant Name', 'Player Info', 'Player Stats', 'Payment'];
    } else {
      return ['Team', 'Contact Info', 'Coach Info', 'Payment'];
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const [registration, setRegistration] = useState<any>({});

  const onChange = (name: string, value: string | number) => {
    setRegistration({ ...registration, [name]: value });
  };

  const fillParticipantInfo = (info: any) => {
    setRegistration({ ...registration, ...info });
  };

  const fillCoachInfo = (info: any) => {
    setRegistration({ ...registration, ...info });
  };

  const onTypeChange = (e: any) => {
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
            />
          );
        case 2:
          return <PlayerStats onChange={onChange} data={registration} />;
        default:
          return <Payment onChange={onChange} data={registration} />;
      }
    } else {
      switch (step) {
        case 0:
          return <Team onChange={onChange} data={registration} />;
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
          return <Payment onChange={onChange} data={registration} />;
      }
    }
  };

  // Stripe

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return Toasts.errorToast('Something went wrong');
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      return Toasts.errorToast(error.message || 'Something wend wrong');
    }
    console.log(paymentMethod);
  };

  console.log(registration);
  return (
    <div className={styles.container}>
      <div style={{ height: '100px', backgroundColor: '#1c315f' }}>Header</div>
      <div className={styles.stepperWrapper}>
        <HeadingLevelTwo>{`${TypeOptions[type]} Registration`}</HeadingLevelTwo>
        <Paper>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            style={{ backgroundColor: 'transparent', width: '1200px' }}
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
                        activeStep === steps.length - 1 ? 'Register' : 'Next'
                      }
                    />
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <div className={styles.section}>
              <div style={{ width: '100%' }}>
                All steps completed - you&apos;re finished
              </div>
            </div>
          )}
        </Paper>
      </div>

      <Modal isOpen={isOpenModalOpen} onClose={() => {}}>
        <div className={styles.modalContainer}>
          <div style={{ height: '185px' }}>
            <p className={styles.message}>
              Do you want to register an individual or a team?
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
    </div>
  );
};

export default RegisterPage;
