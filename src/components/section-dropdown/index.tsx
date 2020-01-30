import React from 'react'
import HeadeingLevelThree from '../heading-level-three'
import ButtonCorner from '../button-corner'
import { BindingAction } from '../../models/callback'
import styles from './styles.module.scss'

interface Props {
  isOpen: boolean;
  onDropdownToggle: BindingAction;
}

const CORNER_BTN_STYLES = {
  width: '15px',
  height: '15px',
  borderWidth: '4px'
}

const SectionDropdown = ({ isOpen, onDropdownToggle }: Props) => (
  <section className={styles.Section}>
    <div className={styles.headerWrapper}>
      <HeadeingLevelThree>Messaging</HeadeingLevelThree>
      <ButtonCorner isActive={isOpen} onClick={onDropdownToggle} styles={CORNER_BTN_STYLES} />
    </div>
    {isOpen ? <p>Content</p> : null}
  </section>
)

export default SectionDropdown;
