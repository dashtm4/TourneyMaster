import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import {
  getDivisionsTeams,
  getPools,
  savePool,
  saveTeams,
} from './logic/actions';
import Modal from '../common/modal';
import AddPool from './division/add-pool';
import { BindingCbWithOne } from 'common/models/callback';
import { ITeam, IDivision } from 'common/models';
import { IPool } from 'common/models';
import { CircularProgress } from '@material-ui/core';
import Division from './division';
import { PopupTeamEdit } from 'components/common';
import PopupDeleteTeam from './popup-delete-team';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';

const ICON_STYLES = {
  marginRight: '5px',
};
interface IDivisionsAndPoolsProps {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  isLoading: boolean;
  areDetailsLoading: boolean;
  history: History;
  match: any;
  getDivisionsTeams: BindingCbWithOne<string>;
  getPools: BindingCbWithOne<string>;
  savePool: BindingCbWithOne<Partial<IPool>>;
  saveTeams: BindingCbWithOne<ITeam[]>;
}

interface IDivisionAndPoolsState {
  isModalOpen: boolean;
  selected: IDivision;
  expanded: boolean[];
  expandAll: boolean;
  isArrange: boolean;
  teams: ITeam[];
  configurableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
  isDeletePopupOpen: boolean;
  isEditPopupOpen: boolean;
}

class DivisionsAndPools extends React.Component<
  IDivisionsAndPoolsProps,
  IDivisionAndPoolsState
> {
  eventId = this.props.match.params.eventId;

  constructor(props: IDivisionsAndPoolsProps) {
    super(props);

    this.state = {
      isModalOpen: false,
      selected: this.props.divisions[0],
      expanded: [],
      expandAll: false,
      isArrange: false,
      teams: [],
      configurableTeam: null,
      currentDivision: null,
      currentPool: null,
      isDeletePopupOpen: false,
      isEditPopupOpen: false,
    };
  }

  componentDidMount() {
    this.props.getDivisionsTeams(this.eventId);
  }

  componentDidUpdate(
    prevProps: IDivisionsAndPoolsProps,
    prevState: IDivisionAndPoolsState
  ) {
    const { teams } = this.props;

    if (this.state.teams.length === 0) {
      this.setState({ teams });
    }

    if (
      prevProps.divisions !== this.props.divisions &&
      !prevState.expanded.length
    ) {
      this.setState({ expanded: this.props.divisions.map(_division => true) });
    }
  }

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
  };

  onAddDivision = () => {
    const path = this.eventId
      ? `/event/divisions-and-pools-add/${this.eventId}`
      : '/event/divisions-and-pools-add';
    this.props.history.push(path);
  };

  onAddPool = (division: IDivision) => {
    this.setState({ isModalOpen: true, selected: division });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  Loading = () => (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );

  onArrangeClick = () =>
    this.setState(({ isArrange }) => ({ isArrange: !isArrange }));

  onCancelClick = () => {
    const { teams } = this.props;

    this.setState({ isArrange: false, teams });
  };

  onSaveClick = () => {
    const eventId = this.props.match.params.eventId;
    const { saveTeams } = this.props;
    const { teams } = this.state;

    if (eventId) {
      saveTeams(teams);
    }
    this.setState({ isArrange: false });
  };

  changePool = (
    team: ITeam,
    divisionId: string | null,
    poolId: string | null
  ) => {
    const changedTeam = {
      ...team,
      division_id: divisionId,
      pool_id: poolId,
      isChange: true,
    };

    this.setState(({ teams }) => ({
      teams: teams.map(it =>
        it.team_id === changedTeam.team_id ? changedTeam : it
      ),
    }));
  };

  onEditPopupOpen = (team: ITeam, divisionName: string, poolName: string) =>
    this.setState({
      isEditPopupOpen: true,
      configurableTeam: team,
      currentDivision: divisionName,
      currentPool: poolName,
    });

  onChangeTeam = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    this.setState(({ configurableTeam }) => ({
      configurableTeam: {
        ...(configurableTeam as ITeam),
        [name]: value,
        isChange: true,
      },
    }));

  onSaveTeam = () => {
    const { configurableTeam } = this.state;

    if (configurableTeam) {
      this.setState(({ teams }) => ({
        teams: teams.map(it =>
          it.team_id === configurableTeam.team_id ? configurableTeam : it
        ),
      }));
    }

    this.onCloseModal();
  };

  onDeleteTeam = (team: ITeam) => {
    this.setState(({ teams }) => ({
      teams: teams.map(it =>
        it.team_id === team.team_id ? { ...it, isDelete: true } : it
      ),
    }));

    this.onCloseModal();
  };

  onDeletePopupOpen = (team: ITeam) =>
    this.setState({ configurableTeam: team, isDeletePopupOpen: true });

  onCloseModal = () =>
    this.setState({
      configurableTeam: null,
      currentDivision: null,
      isEditPopupOpen: false,
      isDeletePopupOpen: false,
    });

  render() {
    const { divisions, pools, isLoading } = this.props;
    const {
      teams,
      configurableTeam,
      currentDivision,
      currentPool,
      isArrange,
      isEditPopupOpen,
      isDeletePopupOpen,
    } = this.state;

    const notDeletedTeams = teams.filter((it: ITeam) => !it.isDelete);

    return (
      <section className={styles.container}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            {isArrange ? (
              <p>
                <Button
                  onClick={this.onCancelClick}
                  label="Cancel"
                  variant="text"
                  color="secondary"
                />
                <span className={styles.btnWrapper}>
                  <Button
                    onClick={this.onSaveClick}
                    label="Save"
                    variant="contained"
                    color="primary"
                  />
                </span>
              </p>
            ) : (
              <p>
                <Button
                  onClick={this.onArrangeClick}
                  icon={getIcon(Icons.EDIT, ICON_STYLES)}
                  label="Arrange Teams"
                  variant="text"
                  color="secondary"
                />
                <span className={styles.btnWrapper}>
                  <Button
                    label="+ Add Division"
                    variant="contained"
                    color="primary"
                    onClick={this.onAddDivision}
                  />
                </span>
              </p>
            )}
          </div>
        </Paper>
        <div className={styles.sectionContainer}>
          <div className={styles.headingContainer}>
            <HeadingLevelTwo>Divisions &amp; Pools</HeadingLevelTwo>
            {divisions?.length ? (
              <Button
                label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
                variant="text"
                color="secondary"
                onClick={this.onToggleAll}
              />
            ) : null}
          </div>
          {isLoading && this.Loading()}
          {divisions.length && !isLoading && this.state.expanded.length ? (
            <>
              <ul className={styles.divisionsList}>
                {divisions.map((division, index) => (
                  <li key={division.division_id}>
                    <Division
                      eventId={this.eventId}
                      division={division}
                      pools={pools.filter(
                        pool => pool.division_id === division.division_id
                      )}
                      teams={notDeletedTeams}
                      onAddPool={this.onAddPool}
                      getPools={this.props.getPools}
                      areDetailsLoading={this.props.areDetailsLoading}
                      divisions={this.props.divisions}
                      expanded={this.state.expanded[index]}
                      index={index}
                      onToggleOne={this.onToggleOne}
                      isArrange={isArrange}
                      isUnassigned={false}
                      changePool={this.changePool}
                      onDeletePopupOpen={this.onDeletePopupOpen}
                      onEditPopupOpen={this.onEditPopupOpen}
                    />
                  </li>
                ))}
                <Division
                  eventId={this.eventId}
                  pools={[]}
                  teams={notDeletedTeams}
                  onAddPool={this.onAddPool}
                  getPools={this.props.getPools}
                  areDetailsLoading={this.props.areDetailsLoading}
                  divisions={this.props.divisions}
                  expanded={this.state.expanded[this.state.expanded.length - 1]}
                  index={this.state.expanded.length - 1}
                  onToggleOne={this.onToggleOne}
                  isArrange={isArrange}
                  isUnassigned={true}
                  changePool={this.changePool}
                  onDeletePopupOpen={this.onDeletePopupOpen}
                  onEditPopupOpen={this.onEditPopupOpen}
                />
                {this.state.selected && (
                  <Modal
                    isOpen={this.state.isModalOpen}
                    onClose={this.onModalClose}
                  >
                    <AddPool
                      division={this.state.selected}
                      onClose={this.onModalClose}
                      savePool={this.props.savePool}
                      numOfTeams={
                        teams.filter(
                          (team: ITeam) =>
                            team.division_id === this.state.selected.division_id
                        ).length
                      }
                    />
                  </Modal>
                )}
              </ul>
            </>
          ) : (
            !isLoading && (
              <div className={styles.noFoundWrapper}>
                <span>There are no divisions yet.</span>
              </div>
            )
          )}
        </div>
        <Modal
          isOpen={isDeletePopupOpen || isEditPopupOpen}
          onClose={this.onCloseModal}
        >
          <>
            {isEditPopupOpen && (
              <PopupTeamEdit
                team={configurableTeam}
                division={currentDivision}
                pool={currentPool}
                onChangeTeam={this.onChangeTeam}
                onSaveTeamClick={this.onSaveTeam}
                onDeleteTeamClick={this.onDeleteTeam}
                onCloseModal={this.onCloseModal}
              />
            )}
            {isDeletePopupOpen && (
              <PopupDeleteTeam
                team={configurableTeam}
                onCloseModal={this.onCloseModal}
                onDeleteClick={this.onDeleteTeam}
              />
            )}
          </>
        </Modal>
      </section>
    );
  }
}

interface IState {
  divisions: {
    data: IDivision[];
    pools: IPool[];
    teams: ITeam[];
    isLoading: boolean;
    areDetailsLoading: boolean;
  };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
  pools: state.divisions.pools,
  teams: state.divisions.teams,
  isLoading: state.divisions.isLoading,
  areDetailsLoading: state.divisions.areDetailsLoading,
});

const mapDispatchToProps = {
  getDivisionsTeams,
  getPools,
  savePool,
  saveTeams,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
