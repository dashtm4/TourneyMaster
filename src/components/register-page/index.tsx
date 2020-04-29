import React, { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
// import Typography from '@material-ui/core/Typography';
import { Button, HeadingLevelThree } from 'components/common';
import styles from './styles.module.scss';
import Paper from 'components/common/paper';
import RegistrantName from './individuals/registrant-name';
import PlayerInfo from './individuals/player-info';
import PlayerStats from './individuals/player-stats';
import Payment from './individuals/payment';

const getSteps = () => {
  return ['Registrant Name', 'Player Info', 'Player Stats', 'Payment'];
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

  const [registration, setRegistration] = useState<any>({});

  const onChange = (name: string, value: string | number) => {
    setRegistration({ ...registration, [name]: value });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <RegistrantName onChange={onChange} data={registration} />;
      case 1:
        return <PlayerInfo onChange={onChange} data={registration} />;
      case 2:
        return <PlayerStats onChange={onChange} data={registration} />;
      default:
        return <Payment onChange={onChange} data={registration} />;
    }
  };
  console.log(registration);
  return (
    <div className={styles.container}>
      <div className={styles.stepperWrapper}>
        <Paper>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            style={{ backgroundColor: 'transparent' }}
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
        </Paper>
      </div>
    </div>
  );
};

export default RegisterPage;
