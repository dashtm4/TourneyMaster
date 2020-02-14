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
import Modal from '../common/modal';
import AddPool from './add-pool';

const divisionData = {
  division_id: '110AFC3B',
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

class DivisionsAndPools extends React.Component<IDivisionsAndPoolsProps, any> {
  state = { isModalOpen: false };

  componentDidMount() {
    this.props.getDivisions();
  }

  onAddDivision = () => {
    const eventId = this.props.match.params.eventId;
    const path = eventId
      ? `/event/divisions-and-pools-add/${eventId}`
      : '/event/divisions-and-pools-add';
    this.props.history.push(path);
  };

  onEditDivisionDetails = (divisionId: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventId = this.props.match.params.eventId;
    const path = eventId
      ? `/event/divisions-and-pools-edit/${eventId}`
      : '/event/divisions-and-pools-edit';
    this.props.history.push({ pathname: path, state: { divisionId } });
  };

  onAddPool = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <section>
        <Paper>
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
                <SectionDropdown padding="0" isDefaultExpanded={true}>
                  <div className={styles.sectionTitle}>
                    <div>{`Division: ${division.long_name}`}</div>
                    <Button
                      label="Edit Division Details"
                      variant="text"
                      color="secondary"
                      icon={<CreateIcon />}
                      onClick={this.onEditDivisionDetails(division.division_id)}
                    />
                  </div>
                  <div className={styles.sectionContent}>
                    <DivisionDetails data={division} />
                    <PoolsDetails onAddPool={this.onAddPool} />
                    <Modal
                      isOpen={this.state.isModalOpen}
                      onClose={this.onModalClose}
                    >
                      <AddPool
                        division={division.long_name}
                        teams={division.teams_registered}
                        onClose={this.onModalClose}
                      />
                    </Modal>
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
