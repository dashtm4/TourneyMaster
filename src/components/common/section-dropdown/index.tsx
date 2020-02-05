import React from 'react';
import HeadeingLevelThree from '../headings/heading-level-three';
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanel,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles.module.scss';

type DropdownType = 'section' | 'block';

interface Props {
  children: React.ReactElement[];
  padding?: string;
  type?: DropdownType;
}

const setStyleOnType = (type?: DropdownType) =>
  type && type === 'section'
    ? {
        background: 'transparent',
        boxShadow: 'none',
      }
    : {};

const setPanelSummaryStyle = (type?: DropdownType) =>
  type && type === 'section' ? { paddingLeft: 0 } : {};

const SectionDropdown = ({ children, padding, type }: Props) => (
  <section className={styles.section}>
    <ExpansionPanel style={setStyleOnType(type)}>
      <ExpansionPanelSummary
        style={setPanelSummaryStyle(type)}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <HeadeingLevelThree>{children[0]}</HeadeingLevelThree>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ padding }}>
        {children[1]}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </section>
);

export default SectionDropdown;
