import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import SectionDropdown from '../common/section-dropdown';
import DivisionDetails from './division-details';
import PoolsDetails from './pools-details';
import CreateIcon from '@material-ui/icons/Create';
import { getDivisions, getPools, getTeams, savePool } from './logic/actions';
import Modal from '../common/modal';
import AddPool from './add-pool';
import { BindingCbWithOne } from 'common/models/callback';
import { ITeam, IDivision } from 'common/models';
import { IPool } from 'common/models';
import { CircularProgress } from '@material-ui/core';

interface IDivisionsAndPoolsProps {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  isLoading: boolean;
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
}
// const getDefaultDivisionState = (registration: any) => ({
//   entry_fee: registration.entry_fee,
//   max_num_teams: registration.max_teams_per_division,
// });

class DivisionsAndPools extends React.Component<
  IDivisionsAndPoolsProps,
  IDivisionAndPoolsState
> {
  eventId = this.props.match.params.eventId;
  state = { isModalOpen: false, selected: this.props.divisions[0] };

  componentDidMount() {
    this.props.getDivisions(this.eventId);
  }

  onAddDivision = () => {
    const path = this.eventId
      ? `/event/divisions-and-pools-add/${this.eventId}`
      : '/event/divisions-and-pools-add';
    this.props.history.push(path);
  };

  onEditDivisionDetails = (divisionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const path = this.eventId
      ? `/event/divisions-and-pools-edit/${this.eventId}`
      : '/event/divisions-and-pools-edit';
    this.props.history.push({ pathname: path, state: { divisionId } });
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
      <section>
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
          </div>
          {isLoading && this.Loading()}
          {divisions.length && !isLoading ? (
            <ul className={styles.divisionsList}>
              {divisions.map(division => (
                <li key={division.division_id}>
                  <SectionDropdown
                    id={division.short_name}
                    isDefaultExpanded={true}
                    panelDetailsType="flat"
                  >
                    <div className={styles.sectionTitle}>
                      <div>{`Division: ${division.short_name}`}</div>
                      <div>
                        <Button
                          label="Edit Division Details"
                          variant="text"
                          color="secondary"
                          icon={<CreateIcon />}
                          onClick={this.onEditDivisionDetails(
                            division.division_id
                          )}
                        />
                      </div>
                    </div>
                    <div className={styles.sectionContent}>
                      <DivisionDetails data={division} />
                      <PoolsDetails
                        onAddPool={this.onAddPool}
                        division={division}
                        getPools={this.props.getPools}
                        getTeams={this.props.getTeams}
                        pools={pools.filter(
                          pool => pool.division_id === division.division_id
                        )}
                        teams={teams.filter(
                          team => team.division_id === division.division_id
                        )}
                      />
                    </div>
                  </SectionDropdown>
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
                  />
                </Modal>
              )}
            </ul>
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
  };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
  pools: state.divisions.pools,
  teams: state.divisions.teams,
  isLoading: state.divisions.isLoading,
});

const mapDispatchToProps = {
  getDivisions,
  getPools,
  getTeams,
  savePool,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
