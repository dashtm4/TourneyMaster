import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
import { MenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo, IEventDetails } from 'common/models';
import { IEntity } from 'common/types';

interface Props {
  events: IEventDetails[];
  isSectionCollapse: boolean;
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const Tournaments = ({
  events,
  isSectionCollapse,
  changeSharedItem,
}: Props) => {
  const onShareTournament = (id: string) => {
    const editedTournament = events.find(it => it.event_id === id);

    changeSharedItem(editedTournament!, EntryPoints.EVENTS);
  };

  const rowForTable = events.map(it => ({
    id: it.event_id,
    title: it.event_name,
    lastModified: it.updated_datetime || (it.created_datetime as string),
  }));

  return (
    <li>
      <SectionDropdown
        id={MenuTitles.TOURNAMENTS}
        type="section"
        panelDetailsType="flat"
        expanded={isSectionCollapse}
      >
        <span>{MenuTitles.TOURNAMENTS}</span>
        <TableSort rows={rowForTable} onShare={onShareTournament} />
      </SectionDropdown>
    </li>
  );
};

export default Tournaments;
