/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadLibraryManagerData, saveSharedItem } from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import PopupShare from './components/popup-share';
import Registration from './components/registration';
import { HeadingLevelTwo, Loader } from 'components/common';
import {
  BindingAction,
  IEventDetails,
  BindingCbWithThree,
} from 'common/models';
import { MenuTitles, EntryPoints } from 'common/enums';
import { IEntity } from 'common/types';
import { ILibraryManagerRegistration } from './common';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  events: IEventDetails[];
  registrations: ILibraryManagerRegistration[];
  loadLibraryManagerData: BindingAction;
  saveSharedItem: BindingCbWithThree<IEventDetails, IEntity, EntryPoints>;
}

const LibraryManager = ({
  isLoading,
  events,
  registrations,
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navigation />
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>{MenuTitles.LIBRARY_MANAGER}</HeadingLevelTwo>
      </div>
      <ul className={styles.libraryList}>
        <Registration
          registrations={registrations}
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
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadLibraryManagerData, saveSharedItem }, dispatch)
)(LibraryManager);
