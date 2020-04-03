import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { EventMenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo, IFacility } from 'common/models';
import { IEntity } from 'common/types';

interface Props {
  facilities: IFacility[];
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const Facilities = ({ facilities, changeSharedItem }: Props) => {
  const onShareRegistr = (id: string) => {
    const editedRegistration = facilities.find(it => it.facilities_id === id);

    changeSharedItem(editedRegistration!, EntryPoints.FACILITIES);
  };

  const rowForTable = facilities.map(it => ({
    id: it.facilities_id,
    title: it.facilities_description,
    version: '1',
    lastModified: it.updated_datetime || (it.created_datetime as string),
  }));

  return (
    <li>
      <SectionDropdown
        id={EventMenuTitles.FACILITIES}
        type="section"
        panelDetailsType="flat"
        isDefaultExpanded={true}
      >
        <span>{EventMenuTitles.FACILITIES}</span>
        <SortTable rows={rowForTable} onShare={onShareRegistr} />
      </SectionDropdown>
    </li>
  );
};

export default Facilities;