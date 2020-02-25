import React from 'react';
import styles from './styles.module.scss';
import Button from '../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';
import Pool from './pool';

interface IPoolsDetails {
  onAddPool: any;
  getPools: any;
  getTeams: any;
  division: any;
  pools: any;
  teams: any;
}

class PoolsDetails extends React.Component<IPoolsDetails, any> {
  componentDidMount() {
    if (!this.props.teams.length) {
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
              icon={<CreateIcon />}
            />
          </div>
        </div>
        <div className={styles.poolsContainer}>
          {pools.map((pool: any) => (
            <Pool
              key={pool.pool_id}
              pool={pool}
              teams={teams.filter((team: any) => team.pool_id === pool.pool_id)}
            />
          ))}
          <Pool teams={teams.filter((team: any) => !team.pool_id)} />
        </div>
      </div>
    );
  }
}

export default PoolsDetails;
