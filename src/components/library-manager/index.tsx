/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import {
  loadLibraryManagerData,
  saveSharedItem,
  deleteLibraryItem,
} from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import PopupShare from './components/popup-share';
import Tournaments from './components/tournaments';
import Registration from './components/registration';
import Facilities from './components/facilities';
import Divisions from './components/divisions';
import Scheduling from './components/scheduling';
import {
  HeadingLevelTwo,
  Loader,
  Button,
  DeletePopupConfrim,
} from 'components/common';
import {
  BindingAction,
  IEventDetails,
  BindingCbWithThree,
  IFacility,
  IDivision,
  ISchedule,
  BindingCbWithTwo,
} from 'common/models';
import {
  MenuTitles,
  EntryPoints,
  ButtonVarian,
  ButtonColors,
} from 'common/enums';
import { IEntity } from 'common/types';
import { ILibraryManagerRegistration, ITableSortEntity } from './common';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  events: IEventDetails[];
  registrations: ILibraryManagerRegistration[];
  facilities: IFacility[];
  divisions: IDivision[];
  schedules: ISchedule[];
  loadLibraryManagerData: BindingAction;
  saveSharedItem: BindingCbWithThree<IEventDetails, IEntity, EntryPoints>;
  deleteLibraryItem: BindingCbWithTwo<IEntity, EntryPoints>;
}

const LibraryManager = ({
  isLoading,
  events,
  registrations,
  facilities,
  divisions,
  schedules,
  loadLibraryManagerData,
  saveSharedItem,
  deleteLibraryItem,
}: Props) => {
  React.useEffect(() => {
    loadLibraryManagerData();
  }, []);
  const [activeEvent, changeActiveEvent] = React.useState<IEventDetails | null>(
    null
  );

  const [sharedItem, changeSharedItem] = React.useState<IEntity | null>(null);

  const [
    tableEntity,
    changeTableEntity,
  ] = React.useState<ITableSortEntity | null>(null);

  const [
    currentEntryPoint,
    changeEntryPoint,
  ] = React.useState<EntryPoints | null>(null);

  const [isSectionsExpand, toggleSectionCollapse] = React.useState<boolean>(
    true
  );

  const [isSharePopupOpen, toggleSharePopup] = React.useState<boolean>(false);

  const [isCondfirmPopupOpen, toggleConfirmPopup] = React.useState<boolean>(
    false
  );

  const onChangeActiveEvent = (event: IEventDetails) => {
    changeActiveEvent(event);
  };

  const onSharedItem = (sharedItem: IEntity, entryPoint: EntryPoints) => {
    changeSharedItem(sharedItem);

    changeEntryPoint(entryPoint);

    toggleSharePopup(true);
  };

  const onConfirmDeleteItem = (
    sharedItem: IEntity,
    tableEntity: ITableSortEntity,
    entryPoint: EntryPoints
  ) => {
    changeSharedItem(sharedItem);

    changeTableEntity(tableEntity);

    changeEntryPoint(entryPoint);

    toggleConfirmPopup(true);
  };

  const onClosePopup = () => {
    changeActiveEvent(null);

    changeTableEntity(null);

    changeSharedItem(null);

    changeEntryPoint(null);

    toggleSharePopup(false);

    toggleConfirmPopup(false);
  };

  const onSaveShatedItem = () => {
    if (activeEvent && sharedItem && currentEntryPoint) {
      saveSharedItem(activeEvent, sharedItem, currentEntryPoint);

      onClosePopup();
    }
  };

  const onDeleteLibraryItem = () => {
    if (sharedItem && currentEntryPoint) {
      deleteLibraryItem(sharedItem, currentEntryPoint);

      onClosePopup();
    }
  };

  const onToggleSectionCollapse = () => {
    toggleSectionCollapse(!isSectionsExpand);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navigation />
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>{MenuTitles.LIBRARY_MANAGER}</HeadingLevelTwo>
        <Button
          onClick={onToggleSectionCollapse}
          variant={ButtonVarian.TEXT}
          color={ButtonColors.SECONDARY}
          label={isSectionsExpand ? 'Collapse All' : 'Expand All'}
        />
      </div>
      <ul className={styles.libraryList}>
        <Tournaments
          events={events}
          isSectionExpand={isSectionsExpand}
          changeSharedItem={onSharedItem}
          onConfirmDeleteItem={onConfirmDeleteItem}
        />
        <Facilities
          facilities={facilities}
          isSectionExpand={isSectionsExpand}
          changeSharedItem={onSharedItem}
          onConfirmDeleteItem={onConfirmDeleteItem}
        />
        <Registration
          registrations={registrations}
          isSectionExpand={isSectionsExpand}
          changeSharedItem={onSharedItem}
          onConfirmDeleteItem={onConfirmDeleteItem}
        />
        <Divisions
          divisions={divisions}
          isSectionExpand={isSectionsExpand}
          changeSharedItem={onSharedItem}
          onConfirmDeleteItem={onConfirmDeleteItem}
        />
        <Scheduling
          schedules={schedules}
          isSectionExpand={isSectionsExpand}
          changeSharedItem={onSharedItem}
          onConfirmDeleteItem={onConfirmDeleteItem}
        />
      </ul>
      <PopupShare
        activeEvent={activeEvent}
        events={events}
        isOpen={isSharePopupOpen}
        onClose={onClosePopup}
        onSave={onSaveShatedItem}
        onChangeActiveEvent={onChangeActiveEvent}
      />
      <DeletePopupConfrim
        type="item"
        deleteTitle={tableEntity?.title || ''}
        isOpen={isCondfirmPopupOpen}
        onClose={onClosePopup}
        onDeleteClick={onDeleteLibraryItem}
      />
    </>
  );
};

export default connect(
  ({ libraryManager }: IAppState) => ({
    isLoading: libraryManager.isLoading,
    isLoaded: libraryManager.isLoaded,
    events: libraryManager.events,
    registrations: libraryManager.registrations,
    facilities: libraryManager.facilities,
    divisions: libraryManager.divisions,
    schedules: libraryManager.schedules,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadLibraryManagerData, saveSharedItem, deleteLibraryItem },
      dispatch
    )
)(LibraryManager);
