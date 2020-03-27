import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'components/common';

interface IProps {
  time: number;
}

enum LoadingStepEnum {
  'Loading Divisions...' = 1,
  'Loading Pools...' = 2,
  'Computing Time Slots...' = 3,
  'Computing Pool Play...' = 4,
  'Solving Premier Fields...' = 5,
  'Solving Proximity and Same Facility requests...' = 6,
  'Solving Team Request...' = 7,
  'Returning Schedule Results...' = 8,
}

const SchedulesLoader = ({ time }: IProps) => {
  const [loadingStep, setLoadingStep] = useState(LoadingStepEnum[1]);
  const [completed, setCompleted] = useState(0);

  const loadSteps = () => {
    let i = 1;
    const stepsNum = 9;
    const updateTime = time / stepsNum;

    setTimeout(function load() {
      if (i < stepsNum) {
        setLoadingStep(LoadingStepEnum[i++]);
        setTimeout(load, updateTime);
      }
    }, updateTime);
  };

  const progress = () => {
    setCompleted(oldCompleted => {
      if (oldCompleted === 100) {
        return 100;
      }
      return oldCompleted + 10;
    });
  };

  useEffect(() => {
    loadSteps();
    const timer = setInterval(progress, 400);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <>
      <ProgressBar completed={completed} type={'loader'} />
      <div style={{ marginTop: '10px', color: '#6a6a6a' }}>{loadingStep}</div>
    </>
  );
};

export default SchedulesLoader;
