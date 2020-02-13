import React from 'react';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import Button from '../../common/buttons/button';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import AddDivisionForm from './add-division-form';

interface IAddDivisionState {
  division: any;
}

class AddDivision extends React.Component<any, IAddDivisionState> {
  state = { division: {} };

  onChange = (name: string, value: any) => {
    this.setState(({ division }) => ({
      division: {
        ...division,
        [name]: value,
      },
    }));
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
                // onClick={this.onCancelClick}
              />
              <Button
                label="Save"
                variant="contained"
                color="primary"
                // onClick={this.onSaveClick}
              />
            </div>
          </div>
        </Paper>
        <div className={styles.heading}>
          <HeadingLevelTwo>Add Division</HeadingLevelTwo>
        </div>
        <AddDivisionForm onChange={this.onChange} />

        <Button
          label="+ Add Additional Division"
          variant="text"
          color="secondary"
          // onClick={this.onAddDivision}
        />
      </section>
    );
  }
}

export default AddDivision;
