import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
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

  const rowForTable = registrations.map(it => ({
    id: it.registration_id,
    title: it.eventName as string,
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
        <TableSort rows={rowForTable} onShare={onShareRegistr} />
      </SectionDropdown>
    </li>
  );
};

export default Registration;
