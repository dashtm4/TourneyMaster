import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import StoriesWrapper from './helpers/stories-wrapper';
import withDropdown from '../hocs/with-dropdown'
import HeadingLevelTwo from '../components/heading-level-two';
import HeadingLevelThree from '../components/heading-level-three';
import HeadingLevelFour from '../components/heading-level-four';
import SectionDropdown from '../components/section-dropdown';
import '../styles/common.scss'

const SectionDropdownWrapped = withDropdown(SectionDropdown);

storiesOf('TourneyMaster', module)
  .add('Headeing Level Two', () => (
    <StoriesWrapper showApp={linkTo('App')}>
      <HeadingLevelTwo>Heading Level Two</HeadingLevelTwo>
    </StoriesWrapper>
  ))
  .add('Headeing Level Three', () => (
    <StoriesWrapper>
      <HeadingLevelThree>Heading Level Three</HeadingLevelThree>
    </StoriesWrapper>
  ))
  .add('Headeing Level Four', () => (
    <StoriesWrapper>
      <HeadingLevelFour>Heading Level Four</HeadingLevelFour>
    </StoriesWrapper>
  ))
  .add('SectionDropdown', () => (
    <StoriesWrapper>
      <SectionDropdownWrapped>There will be content</SectionDropdownWrapped>
    </StoriesWrapper>
  ))
