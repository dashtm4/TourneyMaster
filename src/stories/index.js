import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';
import Button from '../components/common/Buttons/Button';
import Checkbox from '../components/common/Buttons/Checkbox';
import Radio from '../components/common/Buttons/Radio';
import TextField from '../components/common/Input';
import SportsFootballIcon from '@material-ui/icons/SportsFootball';
import Select from '../components/common/select';
import DatePicker from '../components/common/date-picker';

storiesOf('TourneyMaster', module)
  .add('to Test', () => <h1 showApp={linkTo('App')}>Test story</h1>)
  .add('to App', () => <h1 showApp={linkTo('App')}>TourneyMaster🔥</h1>)
  .add('Buttons', () => (
    <>
      <Button
        label="Create tournament"
        variant="contained"
        color="primary"
        onClick={action('button-click')}
      />
      <Button
        label="Link"
        variant="text"
        color="secondary"
        onClick={action('button-click')}
      />
      <Button
        label="Squared"
        variant="contained"
        color="primary"
        type="squared"
        onClick={action('button-click')}
      />
      <Button
        label="Squared outlined"
        variant="contained"
        color="primary"
        type="squaredOutlined"
        onClick={action('button-click')}
      />
      <Button
        label="Delete"
        variant="contained"
        type="danger"
        onClick={action('button-click')}
      />
      <Checkbox
        options={['Option1', 'Option2']}
        formLabel="Choose an option"
        onChange={action('checked')}
      />
      <Radio
        options={['Male', 'Female']}
        formLabel="Gender"
        onChange={action('changed')}
      />
    </>
  ))
  .add('Inputs', () => (
    <>
      <div style={{ margin: '10px 0' }}>
        <TextField label="Name" fullWidth onChange={action('changed')} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <TextField
          endAdornment="search"
          label="Search"
          onChange={action('changed')}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <TextField
          startAdornment={<SportsFootballIcon />}
          label="Icon"
          onChange={action('changed')}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <TextField
          startAdornment="@"
          label="Icon"
          onChange={action('changed')}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <TextField
          endAdornment="minutes"
          label="Duration"
          onChange={action('changed')}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <TextField
          label="Textarea"
          multiline
          rows="4"
          onChange={action('changed')}
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <Select
          options={['Option1', 'Option2', 'Option3']}
          label={'Choose something'}
          onChange={action('selected')}
        />
      </div>
    </>
  ))
  .add('Pickers', () => (
    <>
      <DatePicker onChange={action('picked')} type="date" label="Choose date" />
      <DatePicker onChange={action('picked')} type="time" label="Choose time" />
    </>
  ));
