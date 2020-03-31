import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { MenuTitles } from 'common/enums';
import { ILibraryManagerRegistration, LibraryManagerItem } from '../../common';

interface Props {
  registrations: ILibraryManagerRegistration[];
  changeSharedItem: (item: LibraryManagerItem) => void;
}

const Registration = ({ registrations, changeSharedItem }: Props) => {
  const onShareRegistr = (id: string) => {
    const editedRegistration = registrations.find(
      it => it.registration_id === id
    );

    changeSharedItem(editedRegistration!);
  };

  // ! in future it can not be null(now database has it field like null)
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
    <li>
      <SectionDropdown
        id={MenuTitles.REGISTRATION}
        type="section"
        panelDetailsType="flat"
        isDefaultExpanded={true}
      >
        <span>{MenuTitles.REGISTRATION}</span>
        <SortTable rows={rowForTable} onShare={onShareRegistr} />
      </SectionDropdown>
    </li>
  );
};

export default Registration;
