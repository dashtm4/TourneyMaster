import React from 'react';
import styles from './styles.module.scss';
import Button from '../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';
import Pool from './pool';
import { IPool, ITeam, BindingCbWithOne, IDivision } from 'common/models';
import { Loader } from 'components/common';

interface IPoolsDetailsProps {
  onAddPool: BindingCbWithOne<IDivision>;
  getPools: BindingCbWithOne<string>;
  getTeams: BindingCbWithOne<string>;
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  areDetailsLoading: boolean;
}

class PoolsDetails extends React.Component<IPoolsDetailsProps> {
  componentDidMount() {
    if (!this.props.pools.length && !this.props.teams.length) {
      this.props.getPools(this.props.division.division_id);
      this.props.getTeams(this.props.division.division_id);
    }
  }
  onAdd = () => {
    this.props.onAddPool(this.props.division);
  };

  render() {
    const { pools, teams } = this.props;
    const unassignedTeams = teams.filter(team => !team.pool_id);
    return (
      <div>
        <div className={styles.headingContainer}>
          <span className={styles.title}>Pools</span>
          <div>
            <Button
              label="+ Add Pool"
              variant="text"
              color="secondary"
              onClick={this.onAdd}
            />
            <Button
              label="Edit Pool Details"
              variant="text"
              color="secondary"
              disabled={true}
              icon={<CreateIcon />}
            />
          </div>
        </div>
        {this.props.areDetailsLoading ? (
          <Loader />
        ) : (
          <div className={styles.poolsContainer}>
            {pools.map(pool => (
              <Pool
                key={pool.pool_id}
                pool={pool}
                teams={teams.filter(team => team.pool_id === pool.pool_id)}
              />
            ))}
            {unassignedTeams.length !== 0 && <Pool teams={unassignedTeams} />}
          </div>
        )}
      </div>
    );
  }
}

export default PoolsDetails;
