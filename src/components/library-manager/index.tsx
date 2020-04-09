/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadLibraryManagerData, saveSharedItem } from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import PopupShare from './components/popup-share';
import Tournaments from './components/tournaments';
import Registration from './components/registration';
import Facilities from './components/facilities';
import Divisions from './components/divisions';
import Scheduling from './components/scheduling';
import { HeadingLevelTwo, Loader, Button } from 'components/common';
import {
  BindingAction,
  IEventDetails,
  BindingCbWithThree,
  IFacility,
  IDivision,
  ISchedule,
} from 'common/models';
import {
  MenuTitles,
  EntryPoints,
  ButtonVarian,
  ButtonColors,
} from 'common/enums';
import { IEntity } from 'common/types';
import { ILibraryManagerRegistration } from './common';
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
}: Props) => {
  React.useEffect(() => {
    loadLibraryManagerData();
  }, []);

  const [activeEvent, changeActiveEvent] = React.useState<IEventDetails | null>(
    null
  );
  const [sharedItem, changeSharedItem] = React.useState<IEntity | null>(null);

  const [
    currentEntryPoint,
    changeEntryPoint,
  ] = React.useState<EntryPoints | null>(null);

  const [isSectionsCollapse, toggleSectionCollapse] = React.useState(true);

  const onChangeActiveEvent = (event: IEventDetails) =>
    changeActiveEvent(event);

  const onChangeSharedItem = (sharedItem: IEntity, entryPoint: EntryPoints) => {
    changeSharedItem(sharedItem);

    changeEntryPoint(entryPoint);
  };

  const onClosePopupShare = () => {
    changeSharedItem(null);

    changeActiveEvent(null);
  };

  const onSaveShatedItem = () => {
    if (activeEvent && sharedItem && currentEntryPoint) {
      saveSharedItem(activeEvent, sharedItem, currentEntryPoint);

      onClosePopupShare();
    }
  };

  const onToggleSectionCollapse = () => {
    toggleSectionCollapse(!isSectionsCollapse);
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
          label={isSectionsCollapse ? 'Expand All' : 'Collapse All'}
        />
      </div>
      <ul className={styles.libraryList}>
        <Tournaments
          events={events}
          isSectionCollapse={isSectionsCollapse}
          changeSharedItem={onChangeSharedItem}
        />
        <Facilities
          facilities={facilities}
          isSectionCollapse={isSectionsCollapse}
          changeSharedItem={onChangeSharedItem}
        />
        <Registration
          registrations={registrations}
          isSectionCollapse={isSectionsCollapse}
          changeSharedItem={onChangeSharedItem}
        />
        <Divisions
          divisions={divisions}
          isSectionCollapse={isSectionsCollapse}
          changeSharedItem={onChangeSharedItem}
        />
        <Scheduling
          schedules={schedules}
          isSectionCollapse={isSectionsCollapse}
          changeSharedItem={onChangeSharedItem}
        />
      </ul>
      <PopupShare
        activeEvent={activeEvent}
        events={events}
        isOpen={Boolean(sharedItem)}
        onClose={onClosePopupShare}
        onSave={onSaveShatedItem}
        onChangeActiveEvent={onChangeActiveEvent}
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
    bindActionCreators({ loadLibraryManagerData, saveSharedItem }, dispatch)
)(LibraryManager);
