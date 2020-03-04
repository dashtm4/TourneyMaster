import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import {
  loadOrganizations,
  createOrganization,
  addUserToOrganization,
  deleteOrganization,
} from './logic/actions';
import { HeadingLevelTwo, Loader } from 'components/common';
import OrganizationsList from './components/organizations-list';
import CreateOrganization from './components/create-organization';
import ApplyInvitation from './components/apply-invitation';
import {
  IOrganization,
  BindingAction,
  IConfigurableOrganization,
} from 'common/models';
import { IAddUserToOrg } from './types';
import { getVarcharEight } from 'helpers';
import styles from './styles.module.scss';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  organizations: IOrganization[];
  loadOrganizations: BindingAction;
  createOrganization: (organization: IOrganization) => void;
  addUserToOrganization: ({ orgId, invCode }: IAddUserToOrg) => void;
  deleteOrganization: (organization: IOrganization) => void;
}

class OrganizationsManagement extends React.Component<Props> {
  componentDidMount() {
    const { loadOrganizations } = this.props;

    loadOrganizations();
  }

  addOrganization = async (organizationData: IConfigurableOrganization) => {
    const { createOrganization, addUserToOrganization } = this.props;

    const organization = {
      ...organizationData,
      org_id: getVarcharEight(),
      is_active_YN: 1,
    };

    await createOrganization(organization);

    addUserToOrganization({ orgId: organization.org_id });
  };

  render() {
    const {
      organizations,
      isLoading,
      addUserToOrganization,
      deleteOrganization,
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

    return (
      <section className={styles.container}>
        <div className={styles.heading}>
          <HeadingLevelTwo>Organizations Management</HeadingLevelTwo>
        </div>
        <OrganizationsList
          organizations={organizations}
          deleteOrganization={deleteOrganization}
        />
        <CreateOrganization addOrganization={this.addOrganization} />
        <ApplyInvitation addUserToOrganization={addUserToOrganization} />
      </section>
    );
  }
}

interface IRootState {
  organizationsManagement: AppState;
}

export default connect(
  ({ organizationsManagement }: IRootState) => ({
    isLoading: organizationsManagement.isLoading,
    isLoaded: organizationsManagement.isLoaded,
    organizations: organizationsManagement.organizations,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadOrganizations,
        createOrganization,
        addUserToOrganization,
        deleteOrganization,
      },
      dispatch
    )
)(OrganizationsManagement);
