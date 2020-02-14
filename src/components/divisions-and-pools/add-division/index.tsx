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
  getDivision,
  updateDivision,
} from './add-division-form/logic/actions';
import { IDivision } from 'common/models/divisions';
import { BindingCbWithOne, BindingCbWithTwo } from 'common/models/callback';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteDivision from '../add-division/delete-division';
import Modal from 'components/common/modal';

interface ILocationState {
  divisionId: string;
}

interface IAddDivisionState {
  divisions: Partial<IDivision>[];
  isModalOpen: boolean;
}

interface IDivisionProps {
  history: History;
  location: Location<ILocationState>;
  saveDivisions: BindingCbWithOne<Partial<IDivision>[]>;
  getDivision: BindingCbWithOne<string>;
  updateDivision: BindingCbWithTwo<string, Partial<IDivision>[]>;
}

class AddDivision extends React.Component<IDivisionProps, IAddDivisionState> {
  divisionId = this.props.location.state?.divisionId;
  state = { divisions: [{}], isModalOpen: false };

  componentDidMount() {
    if (this.divisionId) {
      this.props.getDivision(this.divisionId);
    }
  }

  onChange = (name: string, value: any, index: number) => {
    this.setState(({ divisions }) => ({
      divisions: divisions.map(division =>
        division === divisions[index]
          ? { ...division, [name]: value }
          : division
      ),
    }));
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  onSave = () => {
    this.divisionId
      ? this.props.updateDivision(this.divisionId, this.state.divisions)
      : this.props.saveDivisions(this.state.divisions);

    this.props.history.goBack();
  };

  onAddDivision = () => {
    this.setState({ divisions: [...this.state.divisions, {}] });
  };

  onDeleteDivision = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
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

  render() {
    console.log(this.state.divisions);
    console.log(this.divisionId);
    return (
      <section className={styles.container}>
        <Paper>
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
            division={this.state.divisions[index]}
          />
        ))}
        {this.renderButton()}
        <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
          <DeleteDivision onClose={this.onModalClose} />
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = {
  saveDivisions,
  updateDivision,
  getDivision,
};

export default connect(null, mapDispatchToProps)(AddDivision);
