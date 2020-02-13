import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Paper, HeadingLevelTwo } from 'components/common';
import CalendarBody from './body';
import styles from './styles.module.scss';

class Calendar extends Component {
  onSave() {
    console.log('onSave pressed!');
  }

  onCreate = () => {};

  render() {
    return (
      <div className={styles.container}>
        <Paper>
          <div className={styles.paperWrapper}>
            <Button
              label="Save"
              color="primary"
              variant="contained"
              onClick={this.onSave}
            />
          </div>
        </Paper>

        <HeadingLevelTwo margin="24px 0">Calendar</HeadingLevelTwo>

        {/* Calendar manipuation here */}

        {/* Calendar body here */}
        <CalendarBody onCreate={this.onCreate} />
      </div>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
