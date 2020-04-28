import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import { Button, Input, Checkbox } from 'components/common';
import styles from './styles.module.scss';
import Paper from 'components/common/paper';

const getSteps = () => {
  return ['Registrant Name', 'Player Info', 'Payment', 'Player Stats'];
};

const renderRegistrantName = () => (
  <div className={styles.section}>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        <Input
          fullWidth={true}
          label="First Name"
          value={''}
          // onChange={onFirstNameChange}
        />
      </div>
      <div className={styles.sectionItem}>
        <Input
          fullWidth={true}
          label="Last Name"
          value={''}
          // onChange={onLastNameChange}
        />
      </div>
      <div className={styles.sectionItem}>
        <Input
          fullWidth={true}
          label="Email"
          value={''}
          // onChange={onEmailChange}
        />
      </div>
      <div className={styles.sectionItem}>
        <Input
          fullWidth={true}
          label="Mobile"
          value={''}
          // onChange={onEmailChange}
        />
      </div>
    </div>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        <Checkbox
          // onChange={onUpchargeProcessingFeesChange}
          options={[
            {
              label: 'Registrant is participant',
              checked: false,
            },
          ]}
        />
      </div>
    </div>
  </div>
);

const renderPlayerInfo = () => (
  <div className={styles.section}>Player Info</div>
);

const renderPayment = () => <div className={styles.section}>Payment</div>;

const renderPlayerStats = () => (
  <div className={styles.section}>Player Stats</div>
);

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return renderRegistrantName();
    case 1:
      return renderPlayerInfo();
    case 2:
      return renderPayment();
    default:
      return renderPlayerStats();
  }
};

const RegisterPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={styles.container}>
      <Paper>
        <div className={styles.stepperWrapper}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            style={{ backgroundColor: 'transparent' }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div>
                    <div>
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
                          activeStep === steps.length - 1 ? 'Finish' : 'Next'
                        }
                      />
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <div>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button
                onClick={handleReset}
                label="Reset"
                variant="contained"
                color="primary"
              />
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default RegisterPage;
