import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { EventMenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo } from 'common/models';
import { IEntity } from 'common/types';
import { ILibraryManagerRegistration } from '../../common';

interface Props {
  registrations: ILibraryManagerRegistration[];
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const Registration = ({ registrations, changeSharedItem }: Props) => {
  const onShareRegistr = (id: string) => {
    const editedRegistration = registrations.find(
      it => it.registration_id === id
    );

    changeSharedItem(editedRegistration!, EntryPoints.REGISTRATIONS);
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
        id={EventMenuTitles.REGISTRATION}
        type="section"
        panelDetailsType="flat"
        isDefaultExpanded={true}
      >
        <span>{EventMenuTitles.REGISTRATION}</span>
        <SortTable rows={rowForTable} onShare={onShareRegistr} />
      </SectionDropdown>
    </li>
  );
};

export default Registration;
