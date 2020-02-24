import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from 'components/common/paper';
import Button from 'components/common/buttons/button';
import HeadingLevelTwo from 'components/common/headings/heading-level-two';
import AddTeamForm from './create-team-form';
import { saveTeams } from './logic/actions';
import { getDivisions } from 'components/divisions-and-pools/logic/actions';
import {
  BindingCbWithOne,
  IDisision,
  ITeam,
  BindingCbWithThree,
} from 'common/models';
import Modal from 'components/common/modal';
import CancelPopup from './cancel-popup';

interface ICreateTeamState {
  teams: Partial<ITeam>[];
  isModalOpen: boolean;
}

interface ICreateTeamProps {
  history: History;
  match: any;
  divisions: IDisision[];
  saveTeams: BindingCbWithThree<Partial<ITeam>[], string, History>;
  getDivisions: BindingCbWithOne<string>;
}

class CreateTeam extends React.Component<ICreateTeamProps, ICreateTeamState> {
  eventId = this.props.match.params.eventId;
  state = { teams: [{}], isModalOpen: false };

  componentDidMount() {
    this.props.getDivisions(this.eventId);
  }

  onChange = (name: string, value: any, index: number) => {
    this.setState(({ teams }) => ({
      teams: teams.map(team =>
        team === teams[index] ? { ...team, [name]: value } : team
      ),
    }));
  };

  onCancel = () => {
    const changesMade = Object.entries(this.state.teams[0]).length !== 0;
    if (changesMade) {
      this.setState({ isModalOpen: true });
    } else {
      this.props.history.goBack();
    }
  };

  onSave = () => {
    this.props.saveTeams(this.state.teams, this.eventId, this.props.history);
  };

  onAddTeam = () => {
    this.setState({ teams: [...this.state.teams, {}] });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    return (
      <section className={styles.container}>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.onCancel}
              />
              <Button
                label="Save"
                variant="contained"
                color="primary"
                onClick={this.onSave}
              />
            </div>
          </div>
        </Paper>
        <div className={styles.heading}>
          <HeadingLevelTwo>Create Team</HeadingLevelTwo>
        </div>
        {this.state.teams.map((_team, index) => (
          <AddTeamForm
            key={index}
            index={index}
            onChange={this.onChange}
            team={this.state.teams[index]}
            divisions={this.props.divisions}
          />
        ))}
        <Button
          label="+ Add Additional Team"
          variant="text"
          color="secondary"
          onClick={this.onAddTeam}
        />
        <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
          <CancelPopup onSave={this.onSave} history={this.props.history} />
        </Modal>
      </section>
    );
  }
}

interface IState {
  divisions: { data: IDisision[] };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
});

const mapDispatchToProps = {
  saveTeams,
  getDivisions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
