import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import Button from '../components/common/Buttons/Button';
import Checkbox from '../components/common/Buttons/Checkbox';
import Radio from '../components/common/Buttons/Radio';
import TextField from '../components/common/Input';

storiesOf('TourneyMaster', module)
  .add('to Test', () => <h1 showApp={linkTo('App')}>Test story</h1>)
  .add('to App', () => <h1 showApp={linkTo('App')}>TourneyMaster🔥</h1>)
  .add('Buttons', () => (
    <>
      <Button label="Create tournament" color="primary" />
      <Button label="Delete" color="secondary" />
      <Checkbox options={['Option1', 'Option2']} formLabel="Choose an option" />
      <Radio options={['Male', 'Female']} formLabel="Gender" />
    </>
  ))
  .add('Inputs', () => (
    <>
      <TextField />
    </>
  ));
