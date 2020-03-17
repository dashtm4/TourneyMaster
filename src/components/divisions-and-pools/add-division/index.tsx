import React from 'react';
import { connect } from 'react-redux';
import { History, Location } from 'history';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import Button from '../../common/buttons/button';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import AddDivisionForm from './add-division-form';
import {
  saveDivisions,
  updateDivision,
  deleteDivision,
  getRegistration,
} from '../logic/actions';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
  BindingCbWithThree,
} from 'common/models/callback';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteDivision from '../add-division/delete-division';
import Modal from 'components/common/modal';
import { IDivision, ITeam, IPool } from 'common/models';
import { IRegistration } from 'common/models/registration';
import { PopupExposure } from 'components/common';

interface ILocationState {
  divisionId: string;
  pools: IPool[];
  teams: ITeam[];
}

interface IAddDivisionState {
  defaultDivision: Partial<{ entry_fee: number; max_num_teams: number }>;
  divisions: Partial<IDivision>[];
  isModalOpen: boolean;
  isModalConfirmOpen: boolean;
}

interface IDivisionProps {
  history: History;
  location: Location<ILocationState>;
  match: any;
  divisions: IDivision[];
  registration: IRegistration;
  saveDivisions: BindingCbWithTwo<Partial<IDivision>[], string>;
  getDivision: BindingCbWithOne<string>;
  updateDivision: BindingCbWithOne<Partial<IDivision>>;
  deleteDivision: BindingCbWithThree<string, IPool[], ITeam[]>;
  getRegistration: BindingCbWithOne<string>;
}

class AddDivision extends React.Component<IDivisionProps, IAddDivisionState> {
  divisionId = this.props.location.state?.divisionId;
  eventId = this.props.match.params.eventId;
  state = {
    defaultDivision: {},
    divisions: [{}],
    isModalOpen: false,
    isModalConfirmOpen: false,
  };

  componentDidMount() {
    if (this.divisionId) {
      const division: IDivision[] = this.props.divisions.filter(
        div => div.division_id === this.divisionId
      );
      this.setState({ divisions: [division[0]] });
    }
    this.props.getRegistration(this.eventId);
  }

  onChange = (name: string, value: string | number, index: number) => {
    this.setState(({ divisions }) => ({
      divisions: divisions.map(division =>
        division === divisions[index]
          ? { ...division, [name]: value }
          : division
      ),
    }));
  };

  onCancel = () => {
    this.setState({ isModalConfirmOpen: true });
  };

  onSave = () => {
    this.divisionId
      ? this.props.updateDivision(this.state.divisions[0])
      : this.props.saveDivisions(this.state.divisions, this.eventId);
    this.setState({ isModalConfirmOpen: false });
  };

  onAddDivision = () => {
    this.setState({
      divisions: [...this.state.divisions, this.state.defaultDivision],
    });
  };

  onDeleteDivision = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };
  onModalConfirmClose = () => {
    this.setState({ isModalConfirmOpen: false });
  };

  onExit = () => {
    this.props.history.goBack();
  };

  renderHeading = () => {
    const text = this.divisionId ? 'Edit Division' : 'Add Division';
    return <HeadingLevelTwo>{text}</HeadingLevelTwo>;
  };

  renderButton = () => {
    return this.divisionId ? (
      <Button
        label="Delete Division"
        variant="text"
        color="secondary"
        type="dangerLink"
        icon={<DeleteIcon style={{ fill: '#FF0F19' }} />}
        onClick={this.onDeleteDivision}
      />
    ) : (
      <Button
        label="+ Add Additional Division"
        variant="text"
        color="secondary"
        onClick={this.onAddDivision}
      />
    );
  };

  componentDidUpdate(prevProps: IDivisionProps, prevState: IAddDivisionState) {
    if (
      this.props.registration &&
      !prevState.divisions[0]?.division_id &&
      prevProps.registration !== this.props.registration
    ) {
      console.log('upd');
      this.setState({
        defaultDivision: {
          entry_fee: this.props.registration.entry_fee,
          max_num_teams: this.props.registration.max_teams_per_division,
        },
        divisions: [
          {
            entry_fee: this.props.registration.entry_fee,
            max_num_teams: this.props.registration.max_teams_per_division,
          },
        ],
      });
    }
  }

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
        <div className={styles.heading}>{this.renderHeading()}</div>
        {this.state.divisions.map((_division, index) => (
          <AddDivisionForm
            key={index}
            index={index}
            onChange={this.onChange}
            division={this.state.divisions[index] || {}}
            registration={this.props.registration}
          />
        ))}
        {this.renderButton()}
        <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
          <DeleteDivision
            division={this.state.divisions[0]}
            divisionId={this.divisionId}
            onClose={this.onModalClose}
            deleteDivision={this.props.deleteDivision}
            pools={this.props.location.state?.pools}
            teams={this.props.location.state?.teams}
          />
        </Modal>
        <PopupExposure
          isOpen={this.state.isModalConfirmOpen}
          onClose={this.onModalConfirmClose}
          onExitClick={this.onExit}
          onSaveClick={this.onSave}
        />
        {/* <Modal
          isOpen={this.state.isModalConfirmOpen}
          onClose={this.onModalConfirmClose}
        >
          <CancelPopup onSave={this.onSave} />
        </Modal> */}
      </section>
    );
  }
}

interface IState {
  divisions: { data: IDivision[]; registration: IRegistration };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
  registration: state.divisions.registration,
});

const mapDispatchToProps = {
  saveDivisions,
  updateDivision,
  deleteDivision,
  getRegistration,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDivision);
