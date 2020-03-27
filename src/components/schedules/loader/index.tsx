import React, { useState, useEffect } from 'react';

interface IProps {
  time: number;
}

enum LoadingStepEnum {
  'Loading Divisions...' = 1,
  'Loading Pools...' = 2,
  'Computing Time Slots...' = 3,
  'Computing Pool Play...' = 4,
  'Solving Premier Fields...' = 5,
  'Solving Proximity and Same Facility requests' = 6,
  'Solving Team Request' = 7,
  'Returning Schedule Results...' = 8,
}

const SchedulesLoader = ({ time }: IProps) => {
  const [loadingStep, setLoadingStep] = useState(LoadingStepEnum[1]);

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

  useEffect(() => {
    loadSteps();
  }, [time]);

  return <div>{loadingStep}</div>;
};

export default SchedulesLoader;
