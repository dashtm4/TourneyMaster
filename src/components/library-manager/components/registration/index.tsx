import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { MenuTitles } from 'common/enums';
import { ILibraryManagerRegistration } from '../../common';

interface Props {
  registrations: ILibraryManagerRegistration[];
}

const Registration = ({ registrations }: Props) => {
  const onlyTrulyRegistrations = registrations.filter(it =>
    Boolean(it.eventName)
  );

  const rowForTable = onlyTrulyRegistrations.map(it => ({
    id: it.registration_id,
    title: it.eventName as string,
    version: '1',
    lastModified: it.updated_datetime || it.created_datetime,
  }));

  return (
    <SectionDropdown
      id={MenuTitles.REGISTRATION}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
    >
      <span>{MenuTitles.REGISTRATION}</span>
      <SortTable rows={rowForTable} />
    </SectionDropdown>
  );
};

export default Registration;
