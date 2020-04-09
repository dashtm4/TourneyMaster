import React from 'react';
import TableSort from '../table-sort';
import { SectionDropdown } from 'components/common';
import { MenuTitles, EntryPoints } from 'common/enums';
import { BindingCbWithTwo, ISchedule } from 'common/models';
import { IEntity } from 'common/types';

interface Props {
  schedules: ISchedule[];
  isSectionCollapse: boolean;
  changeSharedItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const Scheduling = ({
  schedules,
  isSectionCollapse,
  changeSharedItem,
}: Props) => {
  const onShareSchedule = (id: string) => {
    const editedSchedule = schedules.find(it => it.schedule_id === id);

    changeSharedItem(editedSchedule!, EntryPoints.SCHEDULES);
  };

  const rowForTable = schedules.map(it => ({
    id: it.schedule_id,
    title: it.schedule_name,
    lastModified: it.updated_datetime || it.created_datetime,
  }));

  return (
    <li>
      <SectionDropdown
        id={MenuTitles.SCHEDULING}
        type="section"
        panelDetailsType="flat"
        expanded={isSectionCollapse}
      >
        <span>{MenuTitles.SCHEDULING}</span>
        <TableSort rows={rowForTable} onShare={onShareSchedule} />
      </SectionDropdown>
    </li>
  );
};

export default Scheduling;
