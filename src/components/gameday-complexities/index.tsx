import React from 'react';
import { Button, Paper, CardMessage, HeadingLevelTwo } from 'components/common';
import styles from './styles.module.scss';
import rain from '../../assets/rain.svg';
import Modal from 'components/common/modal';
import { CardMessageTypes } from 'components/common/card-message/types';
import CreateBackupModal from './create-backup-modal';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { connect } from 'react-redux';
import { getEvents, getFacilities, getFields } from './logic/actions';
import { BindingAction, IFacility } from 'common/models';
import { IField } from 'common/models';
import BackupPlan from './backup-plan';

interface Props {
  getEvents: BindingAction;
  getFacilities: BindingAction;
  getFields: BindingAction;
  events: EventDetailsDTO[];
  facilities: IFacility[];
  fields: IField[];
}

interface State {
  isModalOpen: boolean;
  expanded: boolean[];
  expandAll: boolean;
}

const mockData = [
  {
    name: "The Predicted Nor'easter Backup Plan",
    eventName: "Men's Spring Thaw",
    type: 'Cancel Games',
  },
  {
    name: "The Predicted Nor'easter Backup Plan",
    eventName: "Men's Spring Thaw",
    type: 'Cancel Games',
  },
];

class GamedayComplexities extends React.Component<Props, State> {
  state = { isModalOpen: false, expanded: [], expandAll: false };

  componentDidMount() {
    this.props.getEvents();
    this.props.getFacilities();
    this.props.getFields();
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (!prevState.expanded.length) {
      this.setState({ expanded: mockData.map(_plan => true) });
    }
  }

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
  };

  onCreatePlan = () => {
    this.setState({ isModalOpen: true });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  renderEmpty = () => {
    return (
      <div className={styles.sectionContainer}>
        <p className={styles.infoMessage}>
          <span>Shit happens.</span> Create contingency plans here so that your
          event runs smoothly when it needs to
        </p>
        <img src={rain} className={styles.image} alt="rain" />
        <div className={styles.cardMessageContainer}>
          <CardMessage type={CardMessageTypes.EMODJI_OBJECTS}>
            Click “Create Backup Plan” in the Utility Bar to get started
          </CardMessage>
        </div>
      </div>
    );
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
        <div className={styles.headingContainer}>
          <HeadingLevelTwo>Event Day Complexities</HeadingLevelTwo>
          <Button
            label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
            variant="text"
            color="secondary"
            onClick={this.onToggleAll}
          />
        </div>
        {mockData.length
          ? mockData.map((plan, index) => (
              <BackupPlan
                key={index}
                name={plan.name}
                eventName={plan.eventName}
                type={plan.type}
                expanded={this.state.expanded[index]}
                index={index}
                onToggleOne={this.onToggleOne}
              />
            ))
          : this.renderEmpty()}
        <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
          <CreateBackupModal
            onCancel={this.onModalClose}
            events={this.props.events}
            facilities={this.props.facilities}
            fields={this.props.fields}
          />
        </Modal>
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
