/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadLibraryManagerData } from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import PopupShare from './components/popup-share';
import Registration from './components/registration';
import { HeadingLevelTwo, Loader } from 'components/common';
import { BindingAction, IEventDetails } from 'common/models';
import { MenuTitles } from 'common/enums';
import { ILibraryManagerRegistration, LibraryManagerItem } from './common';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  events: IEventDetails[];
  registrations: ILibraryManagerRegistration[];
  loadLibraryManagerData: BindingAction;
}

const LibraryManager = ({
  isLoading,
  events,
  registrations,
  loadLibraryManagerData,
}: Props) => {
  React.useEffect(() => {
    loadLibraryManagerData();
  }, []);

  const [activeEvent, changeActiveEvent] = React.useState<IEventDetails | null>(
    null
  );

  const onChangeActiveEvent = (event: IEventDetails) =>
    changeActiveEvent(event);

  const [
    sharedItem,
    changeSharedItem,
  ] = React.useState<LibraryManagerItem | null>(null);

  const onClosePopupShare = () => {
    changeSharedItem(null);

    changeActiveEvent(null);
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
          changeSharedItem={changeSharedItem}
        />
      </ul>
      <PopupShare
        activeEvent={activeEvent}
        events={events}
        isOpen={Boolean(sharedItem)}
        onClose={onClosePopupShare}
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
    bindActionCreators({ loadLibraryManagerData }, dispatch)
)(LibraryManager);
