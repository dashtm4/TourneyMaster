import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
import { MenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo, IDivision } from 'common/models';
import { IEntity } from 'common/types';
import { ITableSortEntity } from '../../common';

interface Props {
  divisions: IDivision[];
  isSectionCollapse: boolean;
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
  onConfirmDeleteItem: BindingCbWithTwo<ITableSortEntity, EntryPoints>;
}

const Divisions = ({
  divisions,
  isSectionCollapse,
  changeSharedItem,
  onConfirmDeleteItem,
}: Props) => {
  const onShareDivision = (id: string) => {
    const editedDivision = divisions.find(it => it.division_id === id);

    changeSharedItem(editedDivision!, EntryPoints.DIVISIONS);
  };

  const onConfirmDelete = (tableEntity: ITableSortEntity) => {
    onConfirmDeleteItem(tableEntity, EntryPoints.DIVISIONS);
  };

  const rowForTable = divisions.map(it => ({
    id: it.division_id,
    title: it.long_name,
    lastModified: it.updated_datetime || (it.created_datetime as string),
  }));

  return (
    <li>
      <SectionDropdown
        id={MenuTitles.DIVISIONS_AND_POOLS}
        type="section"
        panelDetailsType="flat"
        expanded={isSectionCollapse}
      >
        <span>{MenuTitles.DIVISIONS_AND_POOLS}</span>
        <TableSort
          rows={rowForTable}
          onShare={onShareDivision}
          onDelete={onConfirmDelete}
        />
      </SectionDropdown>
    </li>
  );
};

export default Divisions;
