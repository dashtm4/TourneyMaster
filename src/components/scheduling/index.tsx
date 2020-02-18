import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faFileUpload } from '@fortawesome/free-solid-svg-icons';

import { HeadingLevelTwo, Paper, Button } from 'components/common';
import TourneyArchitect from './tourney-architect';
import TournamentPlay from './tournament-play';
import styles from './styles.module.scss';
import Brackets from './brackets';

class Scheduling extends Component {
  state = {
    schedule: {},
  };

  onChange = (name: string, value: any) => {
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className={styles.container}>
        <Paper>
          <section className={styles.paper}>
            <div>
              <Button
                icon={<FontAwesomeIcon icon={faFileExport} />}
                label="Load From Library"
                color="secondary"
                variant="text"
              />
              &nbsp;
              <Button
                icon={<FontAwesomeIcon icon={faFileUpload} />}
                label="Upload From File"
                color="secondary"
                variant="text"
              />
            </div>
            <Button
              label="Create New Version"
              color="primary"
              variant="contained"
            />
          </section>
        </Paper>
        <HeadingLevelTwo margin="24px 0px">Scheduling</HeadingLevelTwo>
        <TourneyArchitect onChange={this.onChange} />
        <TournamentPlay />
        <Brackets />
      </div>
    );
  }
}

export default Scheduling;
