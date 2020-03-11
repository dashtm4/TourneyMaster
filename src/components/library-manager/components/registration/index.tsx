import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { MenuTitles } from 'common/enums';
import { IRegistration } from 'common/models';

interface Props {
  registrations: IRegistration[];
}

const Registration = ({ registrations }: Props) => (
  <SectionDropdown
    id={MenuTitles.REGISTRATION}
    type="section"
    panelDetailsType="flat"
    isDefaultExpanded={true}
  >
    <span>Registration</span>
    <SortTable rows={registrations} titleField={'reg_first_name'} />
  </SectionDropdown>
);

export default Registration;
