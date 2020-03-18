import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import { getDivisions, getPools, getTeams, savePool } from './logic/actions';
import Modal from '../common/modal';
import AddPool from './division/add-pool';
import { BindingCbWithOne } from 'common/models/callback';
import { ITeam, IDivision } from 'common/models';
import { IPool } from 'common/models';
import { CircularProgress } from '@material-ui/core';

import Division from './division';

interface IDivisionsAndPoolsProps {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  isLoading: boolean;
  areDetailsLoading: boolean;
  history: History;
  match: any;
  getDivisions: BindingCbWithOne<string>;
  getPools: BindingCbWithOne<string>;
  getTeams: BindingCbWithOne<string>;
  savePool: BindingCbWithOne<Partial<IPool>>;
}

interface IDivisionAndPoolsState {
  isModalOpen: boolean;
  selected: Partial<IDivision>;
  expanded: boolean[];
  expandAll: boolean;
}

class DivisionsAndPools extends React.Component<
  IDivisionsAndPoolsProps,
  IDivisionAndPoolsState
> {
  eventId = this.props.match.params.eventId;
  state = {
    isModalOpen: false,
    selected: this.props.divisions[0],
    expanded: [],
    expandAll: false,
  };

  componentDidMount() {
    this.props.getDivisions(this.eventId);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
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

  render() {
    const { divisions, pools, teams, isLoading } = this.props;
    return (
      <section className={styles.container}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div />
            <Button
              label="+ Add Division"
              variant="contained"
              color="primary"
              onClick={this.onAddDivision}
            />
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
          {divisions.length && !isLoading ? (
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
                      teams={teams.filter(
                        team => team.division_id === division.division_id
                      )}
                      onAddPool={this.onAddPool}
                      getPools={this.props.getPools}
                      getTeams={this.props.getTeams}
                      areDetailsLoading={this.props.areDetailsLoading}
                      divisions={this.props.divisions}
                      expanded={this.state.expanded[index]}
                      index={index}
                      onToggleOne={this.onToggleOne}
                    />
                  </li>
                ))}
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
                          team =>
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
  getDivisions,
  getPools,
  getTeams,
  savePool,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
