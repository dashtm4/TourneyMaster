import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import Button from '../../common/buttons/button';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import AddDivisionForm from './add-division-form';
import { saveDivisions } from './add-division-form/logic/actions';
import { IDivision } from 'common/models/divisions';
import { BindingCbWithOne } from 'common/models/callback';

interface IAddDivisionState {
  divisions: Partial<IDivision>[];
}

interface IDivisionProps {
  history: History;
  saveDivisions: BindingCbWithOne<Partial<IDivision>[]>;
}

class AddDivision extends React.Component<IDivisionProps, IAddDivisionState> {
  state = { divisions: [{}] };

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
    this.props.saveDivisions(this.state.divisions);
    this.props.history.goBack();
  };

  onAddDivision = () => {
    this.setState({ divisions: [...this.state.divisions, {}] });
  };

  render() {
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
        <div className={styles.heading}>
          <HeadingLevelTwo>Add Division</HeadingLevelTwo>
        </div>
        {this.state.divisions.map((_division, index) => (
          <AddDivisionForm
            key={index}
            index={index}
            onChange={this.onChange}
            division={this.state.divisions[index]}
          />
        ))}
        <Button
          label="+ Add Additional Division"
          variant="text"
          color="secondary"
          onClick={this.onAddDivision}
        />
      </section>
    );
  }
}

const mapDispatchToProps = {
  saveDivisions,
};

export default connect(null, mapDispatchToProps)(AddDivision);
