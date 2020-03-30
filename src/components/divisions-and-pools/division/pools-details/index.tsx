import React from 'react';
import styles from './styles.module.scss';
import Button from '../../../common/buttons/button';
import CreateIcon from '@material-ui/icons/Create';
import Pool from './pool';
import { IPool, ITeam, BindingCbWithOne, IDivision } from 'common/models';
import { Loader } from 'components/common';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
interface IPoolsDetailsProps {
  onAddPool: BindingCbWithOne<IDivision>;
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  areDetailsLoading: boolean;
  isArrange: boolean;
  changePool: (team: ITeam, divisionId: string, poolId: string | null) => void;
  onDeletePopupOpen: (team: ITeam) => void;
  onEditPopupOpen: (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => void;
}

class PoolsDetails extends React.Component<IPoolsDetailsProps> {
  onAdd = () => {
    const { division } = this.props;

    this.props.onAddPool(division);
  };

  render() {
    const {
      pools,
      teams,
      division,
      isArrange,
      changePool,
      onDeletePopupOpen,
      onEditPopupOpen,
    } = this.props;

    const unassignedTeams = teams.filter(it => !it.pool_id);

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
            <DndProvider backend={HTML5Backend}>
              <Pool
                division={division || null}
                teams={unassignedTeams}
                isArrange={isArrange}
                changePool={changePool}
                onDeletePopupOpen={onDeletePopupOpen}
                onEditPopupOpen={onEditPopupOpen}
              />
              {pools.map(pool => (
                <Pool
                  division={division}
                  pool={pool}
                  teams={teams.filter(team => team.pool_id === pool.pool_id)}
                  key={pool.pool_id}
                  isArrange={isArrange}
                  changePool={changePool}
                  onDeletePopupOpen={onDeletePopupOpen}
                  onEditPopupOpen={onEditPopupOpen}
                />
              ))}
            </DndProvider>
          </div>
        )}
      </div>
    );
  }
}

export default PoolsDetails;
