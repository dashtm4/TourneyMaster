import React from 'react';
import HeadeingLevelThree from '../headings/heading-level-three';
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { ExpansionPanelWrapped } from './expansion-panel-material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles.module.scss';

interface Props {
  children: React.ReactElement[];
}

const SectionDropdown = ({ children }: Props) => (
  <section className={styles.section}>
    <ExpansionPanelWrapped>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <HeadeingLevelThree>{children[0]}</HeadeingLevelThree>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>{children[1]}</ExpansionPanelDetails>
    </ExpansionPanelWrapped>
  </section>
);

export default SectionDropdown;
