import React from 'react';
import styles from './styles.module.scss';
import Button from '../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';
import Pool from './pool';
import { IPool, ITeam, BindingCbWithOne, IDivision } from 'common/models';

interface IPoolsDetailsProps {
  onAddPool: BindingCbWithOne<IDivision>;
  getPools: BindingCbWithOne<string>;
  getTeams: BindingCbWithOne<string>;
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
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
        <div className={styles.poolsContainer}>
          {pools.map(pool => (
            <Pool
              key={pool.pool_id}
              pool={pool}
              teams={teams.filter(team => team.pool_id === pool.pool_id)}
            />
          ))}
          {teams.length !== 0 && (
            <Pool teams={teams.filter(team => !team.pool_id)} />
          )}
        </div>
      </div>
    );
  }
}

export default PoolsDetails;
