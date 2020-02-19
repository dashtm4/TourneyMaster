import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import Paper from '../common/paper';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import SectionDropdown from '../common/section-dropdown';
import DivisionDetails from './division-details';
import PoolsDetails from './pools-details';
import CreateIcon from '@material-ui/icons/Create';
import { getDivisions } from './logic/actions';

const divisionData = {
  long_name: '2020',
  max_num_teams: 32,
  entry_fee: 9.99,
  teams_registered: 10,
  teams_tentitive: 12,
  num_pools: 2,
};

const divisions = [divisionData, divisionData];

interface IDivisionsAndPoolsProps {
  divisions: any;
  history: any;
  match: any;
  getDivisions: () => void;
}

class DivisionsAndPools extends React.Component<IDivisionsAndPoolsProps, {}> {
  componentDidMount() {
    this.props.getDivisions();
  }
  onEditDivisionDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  onAddDivision = () => {
    const eventId = this.props.match.params.eventId;
    const path = eventId
      ? `/event/divisions-and-pools-add/${eventId}`
      : '/event/divisions-and-pools-add';
    this.props.history.push(path);
  };
  render() {
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
            <HeadingLevelTwo>Divisions & Pools</HeadingLevelTwo>
          </div>
          <ul className={styles.divisionsList}>
            {divisions.map((division, index) => (
              <li key={index}>
                <SectionDropdown
                  panelDetailsType="flat"
                  isDefaultExpanded={true}
                >
                  <div className={styles.sectionTitle}>
                    <div>{`Division: ${division.long_name}`}</div>
                    <Button
                      label="Edit Division Details"
                      variant="text"
                      color="secondary"
                      icon={<CreateIcon />}
                      onClick={this.onEditDivisionDetails}
                    />
                  </div>
                  <div className={styles.sectionContent}>
                    <DivisionDetails data={division} />
                    <PoolsDetails />
                  </div>
                </SectionDropdown>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}

interface IState {
  divisions: { data: any };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
});

const mapDispatchToProps = {
  getDivisions,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
