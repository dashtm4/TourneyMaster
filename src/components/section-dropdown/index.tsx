import React from 'react'
import CardWrapper from '../card-wrapper'
import HeadeingLevelThree from '../heading-level-three'
import ButtonCorner from '../button-corner'
import { BindingAction } from '../../models/callback'
import styles from './styles.module.scss'

interface Props {
  children: React.ReactElement;
  // from withDropdown hoc
  isOpen: boolean;
  onDropdownToggle: BindingAction;
}

const CORNER_BTN_STYLES = {
  width: '15px',
  height: '15px',
  borderWidth: '4px'
}

const SectionDropdown = ({ children, isOpen, onDropdownToggle }: Props) => (
  <section className={styles.Section}>
    <div className={styles.headerWrapper}>
      <HeadeingLevelThree>Messaging</HeadeingLevelThree>
      <ButtonCorner isActive={isOpen} onClick={onDropdownToggle} styles={CORNER_BTN_STYLES} />
    </div>
    {isOpen
      ? <CardWrapper>{children}</CardWrapper>
      : null}
  </section>
)

export default SectionDropdown;
