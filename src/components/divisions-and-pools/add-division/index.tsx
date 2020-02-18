import React from 'react';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import Button from '../../common/buttons/button';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import AddDivisionForm from './add-division-form';
import { saveDivision } from './add-division-form/logic/actions';
import { connect } from 'react-redux';

interface IAddDivisionState {
  division: any;
}

class AddDivision extends React.Component<any, IAddDivisionState> {
  state = { division: { event_id: this.props.match.params.event_id } };

  onChange = (name: string, value: any) => {
    this.setState(({ division }) => ({
      division: {
        ...division,
        [name]: value,
      },
    }));
  };

  onSave = () => {
    this.props.saveDivision(this.state.division);
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
                // onClick={this.onCancelClick}
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
