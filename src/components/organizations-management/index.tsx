/* eslint-disable react-hooks/exhaustive-deps */
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
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  organizations: IOrganization[];
  loadOrganizations: BindingAction;
  createOrganization: (organization: IConfigurableOrganization) => void;
  addUserToOrganization: (invCode: string) => void;
  deleteOrganization: (organization: IOrganization) => void;
}

const OrganizationsManagement = ({
  organizations,
  isLoading,
  addUserToOrganization,
  createOrganization,
  deleteOrganization,
  loadOrganizations,
}: Props) => {
  const [expanded, setExpanded] = React.useState([true, true, true]);
  const [expandAll, setExpandAll] = React.useState(false);

  React.useEffect(() => {
    loadOrganizations();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const onToggleAll = () => {
    setExpanded(expanded.map(_e => expandAll));
    setExpandAll(!expandAll);
  };

  const onToggleOne = (indexPanel: number) => {
    setExpanded(
      expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      )
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.heading}>
        <HeadingLevelTwo>Collaboration</HeadingLevelTwo>
        <Button
          label={expandAll ? 'Expand All' : 'Collapse All'}
          variant="text"
          color="secondary"
          onClick={onToggleAll}
        />
      </div>
      <OrganizationsList
        organizations={organizations}
        deleteOrganization={deleteOrganization}
        index={0}
        expanded={expanded[0]}
        onToggleOne={onToggleOne}
      />
      <CreateOrganization
        createOrganization={createOrganization}
        index={1}
        expanded={expanded[1]}
        onToggleOne={onToggleOne}
      />
      <ApplyInvitation
        addUserToOrganization={addUserToOrganization}
        index={2}
        expanded={expanded[2]}
        onToggleOne={onToggleOne}
      />
    </section>
  );
};

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
