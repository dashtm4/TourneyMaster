import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

storiesOf('TourneyMaster', module)
  .add('to Test', () => <h1 showApp={linkTo('App')}>Test story</h1>)
  .add('to App', () => <h1 showApp={linkTo('App')}>TourneyMaster🔥</h1>)
