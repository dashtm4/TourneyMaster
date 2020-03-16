import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from 'components/common/paper';
import Button from 'components/common/buttons/button';
import HeadingLevelTwo from 'components/common/headings/heading-level-two';
import AddTeamForm from './create-team-form';
import { saveTeams } from './logic/actions';
import {
  BindingCbWithOne,
  IDivision,
  ITeam,
  BindingCbWithThree,
} from 'common/models';
import { PopupExposure } from 'components/common';

interface ICreateTeamState {
  teams: Partial<ITeam>[];
  isModalOpen: boolean;
}

interface ICreateTeamProps {
  history: History;
  match: any;
  divisions: IDivision[];
  saveTeams: BindingCbWithThree<Partial<ITeam>[], string, History>;
  getDivisions: BindingCbWithOne<string>;
}

class CreateTeam extends React.Component<ICreateTeamProps, ICreateTeamState> {
  eventId = this.props.match.params.eventId;
  state = { teams: [{}], isModalOpen: false };

  onChange = (name: string, value: string | number, index: number) => {
    this.setState(({ teams }) => ({
      teams: teams.map(team =>
        team === teams[index] ? { ...team, [name]: value } : team
      ),
    }));
  };

  onCancel = () => {
    this.setState({ isModalOpen: true });
  };

  onSave = () => {
    this.props.saveTeams(this.state.teams, this.eventId, this.props.history);
    this.setState({ isModalOpen: false });
  };

  onAddTeam = () => {
    this.setState({ teams: [...this.state.teams, {}] });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  onExit = () => {
    this.props.history.goBack();
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
        <PopupExposure
          isOpen={this.state.isModalOpen}
          onClose={this.onModalClose}
          onExitClick={this.onExit}
          onSaveClick={this.onSave}
        />
      </section>
    );
  }
}

interface IState {
  teams: any;
}

const mapStateToProps = (state: IState) => ({
  divisions: state.teams.divisions,
});

const mapDispatchToProps = {
  saveTeams,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
