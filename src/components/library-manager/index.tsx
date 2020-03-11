/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { loadLibraryManagerData } from './logic/actions';
import { AppState } from './logic/reducer';
import Navigation from './components/navigation';
import Registration from './components/registration';
import { HeadingLevelTwo, Loader } from 'components/common';
import { IRegistration, BindingAction } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  registrations: IRegistration[];
  loadLibraryManagerData: BindingAction;
}

const LibraryManager = ({
  isLoading,
  registrations,
  loadLibraryManagerData,
}: Props) => {
  React.useEffect(() => {
    loadLibraryManagerData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navigation />
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>Library Manager</HeadingLevelTwo>
      </div>
      <ul className={styles.libraryList}>
        <li>
          <Registration registrations={registrations} />
        </li>
      </ul>
    </>
  );
};

interface IRootState {
  libraryManager: AppState;
}

export default connect(
  ({ libraryManager }: IRootState) => ({
    isLoading: libraryManager.isLoading,
    isLoaded: libraryManager.isLoaded,
    registrations: libraryManager.registrations,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators({ loadLibraryManagerData }, dispatch)
)(LibraryManager);
