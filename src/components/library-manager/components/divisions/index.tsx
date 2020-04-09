import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
import { MenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo, IDivision } from 'common/models';
import { IEntity } from 'common/types';

interface Props {
  divisions: IDivision[];
  isSectionCollapse: boolean;
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const Divisions = ({
  divisions,
  isSectionCollapse,
  changeSharedItem,
}: Props) => {
  const onShareRegistr = (id: string) => {
    const editedRegistration = divisions.find(it => it.division_id === id);

    changeSharedItem(editedRegistration!, EntryPoints.DIVISIONS);
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
        <TableSort rows={rowForTable} onShare={onShareRegistr} />
      </SectionDropdown>
    </li>
  );
};

export default Divisions;
