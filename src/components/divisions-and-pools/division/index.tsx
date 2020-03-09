import React from 'react';
import SectionDropdown from '../../common/section-dropdown';
import DivisionDetails from './division-details';
import PoolsDetails from './pools-details';
import CreateIcon from '@material-ui/icons/Create';
import Button from '../../common/buttons/button';
import { IDivision, IPool, ITeam, BindingCbWithOne } from 'common/models';
import styles from '../styles.module.scss';
import history from '../../../browserhistory';

interface IDivisionProps {
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  getPools: BindingCbWithOne<string>;
  getTeams: BindingCbWithOne<string>;
  onAddPool: BindingCbWithOne<IDivision>;
  areDetailsLoading: boolean;
  eventId: string;
  divisions: IDivision[];
}

class Division extends React.PureComponent<IDivisionProps> {
  componentDidMount() {
    this.props.getPools(this.props.division.division_id);
    this.props.getTeams(this.props.division.division_id);
  }

  onEditDivisionDetails = (divisionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const path = this.props.eventId
      ? `/event/divisions-and-pools-edit/${this.props.eventId}`
      : '/event/divisions-and-pools-edit';
    history.push({
      pathname: path,
      state: { divisionId, pools: this.props.pools, teams: this.props.teams },
    });
  };

  render() {
    const { division, pools, teams } = this.props;
    return (
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
              onClick={this.onEditDivisionDetails(division.division_id)}
            />
          </div>
        </div>
        <div className={styles.sectionContent}>
          <DivisionDetails
            data={division}
            numOfPools={pools.length}
            numOfTeams={teams.length}
          />
          <PoolsDetails
            onAddPool={this.props.onAddPool}
            division={division}
            pools={pools}
            teams={teams}
            areDetailsLoading={this.props.areDetailsLoading}
          />
        </div>
      </SectionDropdown>
    );
  }
}

export default Division;
