import React from 'react';
import { Button, Paper, CardMessage } from 'components/common';
import styles from './styles.module.scss';
import rain from '../../assets/rain.svg';
import Modal from 'components/common/modal';
import CreateBackupModal from './create-backup-modal';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { connect } from 'react-redux';
import { getEvents, getFacilities, getFields } from './logic/actions';
import { BindingAction, IFacility } from 'common/models';
import { IField } from 'common/models';

interface Props {
  getEvents: BindingAction;
  getFacilities: BindingAction;
  getFields: BindingAction;
  events: EventDetailsDTO[];
  facilities: IFacility[];
  fields: IField[];
}

class GamedayComplexities extends React.Component<Props> {
  state = { isModalOpen: false };

  componentDidMount() {
    this.props.getEvents();
    this.props.getFacilities();
    this.props.getFields();
  }

  onCreatePlan = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };
  render() {
    return (
      <>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div />
            <Button
              label="Create Backup Plan"
              variant="contained"
              color="primary"
              onClick={this.onCreatePlan}
            />
          </div>
        </Paper>
        <div className={styles.sectionContainer}>
          <p className={styles.infoMessage}>
            <span>Shit happens.</span> Create contingency plans here so that
            your event runs smoothly when it needs to
          </p>
          <img src={rain} className={styles.image} alt="rain" />
          <div className={styles.cardMessageContainer}>
            <CardMessage type="emodjiObjects">
              Click “Create Backup Plan” in the Utility Bar to get started
            </CardMessage>
          </div>
          <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
            <CreateBackupModal
              onCancel={this.onModalClose}
              events={this.props.events}
              facilities={this.props.facilities}
              fields={this.props.fields}
            />
          </Modal>
        </div>
      </>
    );
  }
}

interface IState {
  complexities: {
    data: EventDetailsDTO[];
    facilities: IFacility[];
    fields: IField[];
  };
}

const mapStateToProps = (state: IState) => ({
  events: state.complexities.data,
  facilities: state.complexities.facilities,
  fields: state.complexities.fields,
});

const mapDispatchToProps = {
  getEvents,
  getFacilities,
  getFields,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamedayComplexities);
