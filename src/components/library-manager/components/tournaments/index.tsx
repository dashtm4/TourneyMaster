import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
import { MenuTitles, EntryPoints } from 'common/enums';
import {
  BindingCbWithTwo,
  BindingCbWithThree,
  IEventDetails,
} from 'common/models';
import { IEntity } from 'common/types';
import { ITableSortEntity } from '../../common';

interface Props {
  events: IEventDetails[];
  isSectionExpand: boolean;
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
  onConfirmDeleteItem: BindingCbWithThree<
    IEntity,
    ITableSortEntity,
    EntryPoints
  >;
}

const Tournaments = ({
  events,
  isSectionExpand,
  changeSharedItem,
  onConfirmDeleteItem,
}: Props) => {
  const onShareTournament = (id: string) => {
    const editedTournament = events.find(it => it.event_id === id);

    changeSharedItem(editedTournament!, EntryPoints.EVENTS);
  };

  const onConfirmDelete = (tableEntity: ITableSortEntity) => {
    const currentTournament = events.find(it => it.event_id === tableEntity.id);

    onConfirmDeleteItem(currentTournament!, tableEntity, EntryPoints.EVENTS);
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
        expanded={isSectionExpand}
      >
        <span>{MenuTitles.TOURNAMENTS}</span>
        <TableSort
          rows={rowForTable}
          onShare={onShareTournament}
          onDelete={onConfirmDelete}
        />
      </SectionDropdown>
    </li>
  );
};

export default Tournaments;
