import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import StoriesWrapper from './helpers/stories-wrapper';

import HeadingLevelTwo from '../components/common/headings/heading-level-two';
import HeadingLevelThree from '../components/common/headings/heading-level-three';
import HeadingLevelFour from '../components/common/headings/heading-level-four';

import Button from '../components/common/buttons/button';
import Checkbox from '../components/common/buttons/checkbox';
import Radio from '../components/common/buttons/radio';
import TextField from '../components/common/input';

import SectionDropdown from '../components/common/section-dropdown';

import '../styles/common.scss'

storiesOf('TourneyMaster', module)
  .add('Headeings', () => (
    <StoriesWrapper>
      <HeadingLevelTwo>Heading Level Two</HeadingLevelTwo>
      <HeadingLevelThree>Heading Level Three</HeadingLevelThree>
      <HeadingLevelFour>Heading Level Four</HeadingLevelFour>
    </StoriesWrapper>
  ))
  .add('SectionDropdown', () => (
    <StoriesWrapper>
      <SectionDropdown>
        <span>Its header</span>
        <p>Threre will be content</p>
      </SectionDropdown>
    </StoriesWrapper>
  ))
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
  ))

