import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Loader, Paper, Button, HeadingLevelTwo } from 'components/common';
import {
  getDivisionsTeams,
  getPools,
  savePool,
  saveTeams,
  saveDivisions,
} from './logic/actions';
import Modal from '../common/modal';
import AddPool from './division/add-pool';
import { BindingCbWithOne, BindingCbWithTwo } from 'common/models/callback';
import { ITeam, IDivision } from 'common/models';
import { IPool } from 'common/models';
import Division from './division';
import styles from './styles.module.scss';
import CsvLoader from 'components/common/csv-loader';

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
  saveDivisions: BindingCbWithTwo<Partial<IDivision>[], string>;
}

interface IDivisionAndPoolsState {
  isModalOpen: boolean;
  selected: IDivision;
  expanded: boolean[];
  expandAll: boolean;
  isCsvLoaderOpen: boolean;
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
      isCsvLoaderOpen: false,
    };
  }

  componentDidMount() {
    this.props.getDivisionsTeams(this.eventId);
  }

  componentDidUpdate(
    prevProps: IDivisionsAndPoolsProps,
    prevState: IDivisionAndPoolsState
  ) {
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

  onCsvLoaderBtn = () => {
    this.setState({ isCsvLoaderOpen: true });
  };

  onCsvLoaderClose = () => {
    this.setState({ isCsvLoaderOpen: false });
  };

  render() {
    const { divisions, pools, teams, isLoading, saveTeams } = this.props;

    return (
      <section className={styles.container}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div className={styles.btnsWraper}>
              <Button
                label="Import from CSV"
                color="secondary"
                variant="text"
                onClick={this.onCsvLoaderBtn}
              />
              <Button
                label="+ Add Division"
                variant="contained"
                color="primary"
                onClick={this.onAddDivision}
              />
            </div>
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
          {isLoading && <Loader />}
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
                      teams={teams}
                      onAddPool={this.onAddPool}
                      getPools={this.props.getPools}
                      areDetailsLoading={this.props.areDetailsLoading}
                      divisions={this.props.divisions}
                      expanded={this.state.expanded[index]}
                      index={index}
                      onToggleOne={this.onToggleOne}
                      saveTeams={saveTeams}
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
        <CsvLoader
          isOpen={this.state.isCsvLoaderOpen}
          onClose={this.onCsvLoaderClose}
          type="divisions"
          onCreate={this.props.saveDivisions}
          eventId={this.eventId}
        />
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
  saveDivisions,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
