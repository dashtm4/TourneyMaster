import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import StoriesWrapper from './helpers/stories-wrapper';
import '../styles/common.scss'

import HeadingLevelTwo from '../components/common/headings/heading-level-two';
import HeadingLevelThree from '../components/common/headings/heading-level-three';
import HeadingLevelFour from '../components/common/headings/heading-level-four';
import Button from '../components/common/buttons/button';
import Checkbox from '../components/common/buttons/checkbox';
import Radio from '../components/common/buttons/radio';
import TextField from '../components/common/input';
import SectionDropdown from '../components/common/section-dropdown';
import ProgressBar from '../components/common/progress-bar';
import ColorPicker from '../components/common/color-picker';
import Paper from '../components/common/paper';
import CardMessage from '../components/common/card-message';
import { CardMessageTypes } from '../components/common/card-message/Types';
import TooltipMessage from '../components/common/tooltip-message';
import { TooltipMessageTypes } from '../components/common/tooltip-message/Types';

storiesOf('TourneyMaster', module)
  .add('Headeings', () => (
    <StoriesWrapper>
      <HeadingLevelTwo>Heading Level Two</HeadingLevelTwo>
      <HeadingLevelThree>Heading Level Three</HeadingLevelThree>
      <HeadingLevelFour>Heading Level Four</HeadingLevelFour>
    </StoriesWrapper>
  ))
  .add('Section Dropdown', () => (
    <StoriesWrapper>
      <SectionDropdown>
        <span>Its header</span>
        <p>Threre will be content</p>
      </SectionDropdown>
    </StoriesWrapper>
  ))
  .add('Progress Bar', () => {
    const [completed, setCompleted] = React.useState(0);

    React.useEffect(() => {
      function progress() {
        setCompleted(oldCompleted => {
          if (oldCompleted === 100) {
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldCompleted + diff, 100);
        });
      }

      const timer = setInterval(progress, 500);
      return () => {
        clearInterval(timer);
      };
    }, []);

    return (
      <StoriesWrapper>
        <ProgressBar completed={completed} />
      </StoriesWrapper>
    )
  })
  .add('Color Picker', () => (
    <StoriesWrapper>
      <ColorPicker />
    </StoriesWrapper>
  ))
  .add('Paper', () => (
    <StoriesWrapper>
      <Paper />
    </StoriesWrapper>
  ))
  .add('Card Message', () => (
    <>
      <StoriesWrapper>
        <CardMessage type={CardMessageTypes.INFO}>
          Playoff settings include Bracket Type, # of Teams, and Ranking Factors
        </CardMessage>
      </StoriesWrapper>
      <StoriesWrapper>
        <CardMessage type={CardMessageTypes.WARNING}>
          All existing data in the tournaments Registration section will be overridden!
        </CardMessage>
      </StoriesWrapper>
    </>
  ))
  .add('Tooltip Message', () => (
    <>
      <StoriesWrapper>
        <TooltipMessage type={TooltipMessageTypes.INFO}>
          TRUE Florida (2020, 2021) cannot play 10:00 AM - 12:00 PM
        </TooltipMessage>
      </StoriesWrapper>
      <StoriesWrapper>
        <TooltipMessage type={TooltipMessageTypes.WARNING}>
          All existing data in the tournaments Registration section will be overridden!
        </TooltipMessage>
      </StoriesWrapper>
    </>
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

