import React from 'react';
import { SectionDropdown } from 'components/common';
import { MenuTitles } from 'common/enums';

const Reg = () => (
  <SectionDropdown
    id={MenuTitles.REGISTRATION}
    type="section"
    panelDetailsType="flat"
    isDefaultExpanded={true}
  >
    <span>Tournaments</span>
    <p>Content</p>
  </SectionDropdown>
);

export default Reg;
