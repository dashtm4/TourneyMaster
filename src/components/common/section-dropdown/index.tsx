import React from 'react'
import HeadeingLevelThree from '../headings/heading-level-three'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles.module.scss'

interface Props {
  children: React.ReactElement[];
}

const SectionDropdown = ({ children }: Props) => (
  <section className={styles.section}>
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <HeadeingLevelThree>
          {children[0]}
        </HeadeingLevelThree>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {children[1]}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </section>
)

export default SectionDropdown;
