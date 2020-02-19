import React from 'react';
import styles from './styles.module.scss';
import Button from '../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';
import Pool from './pool';
import { ITeam } from 'common/models';

interface IPoolsDetails {
  onAddPool: any;
  division: any;
  pools: any;
  teams: any;
}

class PoolsDetails extends React.Component<IPoolsDetails, any> {
  onAdd = () => {
    this.props.onAddPool(this.props.division);
  };

  render() {
    const { pools, teams } = this.props;
    console.log(pools);
    const poolsMOCK = [{ pool_id: 1 }, { pool_id: 2 }];

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
          {poolsMOCK.map((pool: any) => (
            <Pool
              key={pool.pool_id}
              pool={pool}
              teams={teams.filter(
                (team: ITeam) => team.pool_id === pool.pool_id
              )}
            />
          ))}
          <div className={styles.pool}>
            <p className={styles.poolTitle}>Unassigned</p>
            <ul>
              <li>None</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default PoolsDetails;
