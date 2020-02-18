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
  isDefaultExpanded?: boolean;
  headingColor?: string;
}

const setStyleOnType = (type?: DropdownType) => {
  switch (type) {
    case 'section':
      return {
        background: 'transparent',
        boxShadow: 'none',
      };
    default:
      return {
        background: '#F4F4F4',
        boxShadow: '0 1px 10px 0 rgba(0,0,0,0.1)',
      };
  }
};

const setExpandIcon = (type?: DropdownType) =>
  type && type === 'section' ? (
    <ExpandMoreIcon />
  ) : (
    <ExpandMoreIcon color="primary" fontSize="large" />
  );

const setPanelSummaryStyle = (type?: DropdownType) =>
  type && type === 'section' ? { paddingLeft: 0 } : {};

const SectionDropdown = ({
  children,
  padding,
  type,
  headingColor,
  isDefaultExpanded,
}: Props) => (
  <section className={styles.section}>
    <ExpansionPanel
      style={setStyleOnType(type)}
      defaultExpanded={isDefaultExpanded}
    >
      <ExpansionPanelSummary
        style={{
          ...setPanelSummaryStyle(type),
          display: 'flex',
        }}
        expandIcon={setExpandIcon(type)}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <HeadeingLevelThree color={headingColor}>
          {children[0]}
        </HeadeingLevelThree>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ padding, display: 'block' }}>
        {children[1]}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </section>
);

export default SectionDropdown;
