import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { MenuTitles } from 'common/enums';
import {
  ILibraryManagerRegistration,
  ILibraryManagerRegistrationFields,
} from '../../common';

interface Props {
  registrations: ILibraryManagerRegistration[];
}

const Registration = ({ registrations }: Props) => {
  const onlyTrulyRegistrations = registrations.filter(it =>
    Boolean(it.eventName)
  );

  return (
    <SectionDropdown
      id={MenuTitles.REGISTRATION}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
    >
      <span>{MenuTitles.REGISTRATION}}</span>
      <SortTable
        rows={onlyTrulyRegistrations}
        titleField={ILibraryManagerRegistrationFields.EVENT_NAME}
      />
    </SectionDropdown>
  );
};

export default Registration;
