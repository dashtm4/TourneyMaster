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
import { getDivisions } from './logic/actions';
import Modal from '../common/modal';
import AddPool from './add-pool';
import { IDivision } from 'common/models/divisions';
import { BindingAction } from 'common/models/callback';

interface IDivisionsAndPoolsProps {
  divisions: IDivision[];
  history: History;
  match: any;
  getDivisions: BindingAction;
}

interface IDivisionAndPoolsState {
  isModalOpen: boolean;
  selected: any;
}

class DivisionsAndPools extends React.Component<
  IDivisionsAndPoolsProps,
  IDivisionAndPoolsState
> {
  eventId = this.props.match.params.eventId;
  state = { isModalOpen: false, selected: this.props.divisions[0] };

  componentDidMount() {
    this.props.getDivisions();
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

  render() {
    const { divisions } = this.props;

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
          {divisions.length ? (
            <ul className={styles.divisionsList}>
              {divisions.map(
                division =>
                  division.event_id === this.eventId && (
                    <li key={division.division_id}>
                      <SectionDropdown padding="0" isDefaultExpanded={true}>
                        <div className={styles.sectionTitle}>
                          <div>{`Division: ${division.long_name}`}</div>
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
                        <div className={styles.sectionContent}>
                          <DivisionDetails data={division} />
                          <PoolsDetails
                            onAddPool={this.onAddPool}
                            division={division}
                          />
                        </div>
                      </SectionDropdown>
                    </li>
                  )
              )}
              {this.state.selected && (
                <Modal
                  isOpen={this.state.isModalOpen}
                  onClose={this.onModalClose}
                >
                  <AddPool
                    division={this.state.selected.long_name}
                    teams={this.state.selected.teams_registered}
                    onClose={this.onModalClose}
                  />
                </Modal>
              )}
            </ul>
          ) : (
            <div>Loading</div>
          )}
        </div>
      </section>
    );
  }
}

interface IState {
  divisions: { data: IDivision[] };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
});

const mapDispatchToProps = {
  getDivisions,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
