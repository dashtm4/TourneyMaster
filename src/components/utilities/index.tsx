import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import { loadUserData, changeUser } from './logic/actions';
import Navigation from './components/navigations';
import EditProfile from './components/edit-profile';
import { HeadingLevelTwo, Loader } from 'components/common';
import { BindingAction, IMember, BindingCbWithOne } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  userData: IMember | null;
  loadUserData: BindingAction;
  changeUser: BindingCbWithOne<Partial<IMember>>;
}

const Utilities = ({
  isLoading,
  userData,
  loadUserData,
  changeUser,
}: Props) => {
  React.useEffect(() => {
    loadUserData();
  }, []);

  if (isLoading || !userData) {
    return <Loader />;
  }

  return (
    <section>
      <form
        onSubmit={evt => {
          evt.preventDefault();
        }}
      >
        <Navigation />
        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Utilities</HeadingLevelTwo>
        </div>
        <EditProfile userData={userData} changeUser={changeUser} />
      </form>
    </section>
  );
};

interface IRootState {
  utilities: AppState;
}

export default connect(
  ({ utilities }: IRootState) => ({
    isLoading: utilities.isLoading,
    isLoaded: utilities.isLoaded,
    userData: utilities.userData,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadUserData,
        changeUser,
      },
      dispatch
    )
)(Utilities);
