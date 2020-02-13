import React from 'react';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import Button from '../../common/buttons/button';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import AddDivisionForm from './add-division-form';
import { saveDivision } from './add-division-form/logic/actions';
import { connect } from 'react-redux';

interface IDivision {
  long_name?: string;
  short_name?: string;
  division_tag?: string;
  entry_fee?: number;
  division_description?: string;
  max_num_teams?: number;
  division_message?: string;
  division_hex?: string;
}

interface IAddDivisionState {
  division: IDivision;
}

interface IDivisionProps {
  history: any;
  saveDivision: (division: IDivision) => void;
}

class AddDivision extends React.Component<IDivisionProps, IAddDivisionState> {
  state = { division: {} };

  componentDidMount() {
    // this.props.getDivision();
  }

  onChange = (name: string, value: any) => {
    this.setState(({ division }) => ({
      division: {
        ...division,
        [name]: value,
      },
    }));
  };

  onCancel = () => {
    this.props.history.goBack();
  };

  onSave = () => {
    this.props.saveDivision(this.state.division);
    this.props.history.goBack();
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
        <AddDivisionForm
          onChange={this.onChange}
          division={this.state.division}
        />
        {/* <Button
          label="+ Add Additional Division"
          variant="text"
          color="secondary"
          // onClick={this.onAddDivision}
        /> */}
      </section>
    );
  }
}

const mapDispatchToProps = {
  saveDivision,
};

export default connect(null, mapDispatchToProps)(AddDivision);
