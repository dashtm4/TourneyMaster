import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import StoriesWrapper from './helpers/stories-wrapper';
import HeadingLevelTwo from '../components/headings/heading-level-two';
import HeadingLevelThree from '../components/headings/heading-level-three';
import HeadingLevelFour from '../components/headings/heading-level-four';
import SectionDropdown from '../components/section-dropdown';
import '../styles/common.scss'

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
      <SectionDropdown>
        <span>Its header</span>
        <p>Threre will be content</p>
      </SectionDropdown>
    </StoriesWrapper>
  ))
