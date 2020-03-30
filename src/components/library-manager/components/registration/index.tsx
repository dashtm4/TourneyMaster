import React from 'react';
import { SectionDropdown, SortTable } from 'components/common';
import { MenuTitles } from 'common/enums';
import { ILibraryManagerRegistration } from '../../common';

interface Props {
  registrations: ILibraryManagerRegistration[];
}

const Registration = ({ registrations }: Props) => {
  const [
    confRegistration,
    onConfRegistration,
  ] = React.useState<ILibraryManagerRegistration | null>(null);

  const onEditRegistr = (id: string) => {
    const editedRegistration = registrations.find(
      it => it.registration_id === id
    );

    onConfRegistration(editedRegistration!);
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
    <>
      <SectionDropdown
        id={MenuTitles.REGISTRATION}
        type="section"
        panelDetailsType="flat"
        isDefaultExpanded={true}
      >
        <span>{MenuTitles.REGISTRATION}</span>
        <SortTable rows={rowForTable} onEdit={onEditRegistr} />
      </SectionDropdown>
      {confRegistration && confRegistration.eventName}
    </>
  );
};

export default Registration;
