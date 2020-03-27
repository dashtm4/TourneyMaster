import React from 'react';
import { Button, Paper, CardMessage, HeadingLevelTwo } from 'components/common';
import styles from './styles.module.scss';
import rain from '../../assets/rain.svg';
import Modal from 'components/common/modal';
import { CardMessageTypes } from 'components/common/card-message/types';
import CreateBackupModal from './create-backup-modal';
import { EventDetailsDTO } from 'components/event-details/logic/model';
import { connect } from 'react-redux';
import {
  getEvents,
  getFacilities,
  getFields,
  getBackupPlans,
  saveBackupPlans,
  deleteBackupPlan,
  updateBackupPlan,
} from './logic/actions';
import { BindingAction, IFacility, BindingCbWithOne } from 'common/models';
import { IField } from 'common/models';
import BackupPlan from './backup-plan';
import { IBackupPlan } from 'common/models/backup_plan';
import { Loader } from 'components/common';

interface Props {
  getEvents: BindingAction;
  getFacilities: BindingAction;
  getFields: BindingAction;
  getBackupPlans: BindingAction;
  saveBackupPlans: BindingCbWithOne<Partial<IBackupPlan>[]>;
  deleteBackupPlan: BindingCbWithOne<string>;
  updateBackupPlan: BindingCbWithOne<Partial<IBackupPlan>>;
  events: EventDetailsDTO[];
  facilities: IFacility[];
  fields: IField[];
  backupPlans: IBackupPlan[];
  isLoading: boolean;
}

interface State {
  isModalOpen: boolean;
  expanded: boolean[];
  expandAll: boolean;
}

class GamedayComplexities extends React.Component<Props, State> {
  state = {
    isModalOpen: false,
    expanded: [],
    expandAll: false,
  };

  componentDidMount() {
    this.props.getEvents();
    this.props.getFacilities();
    this.props.getFields();
    this.props.getBackupPlans();
  }

  componentDidUpdate(_prevProps: Props, _prevState: State) {
    if (this.props.backupPlans !== _prevProps.backupPlans) {
      this.setState({ expanded: this.props.backupPlans.map(_plan => true) });
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
    const { backupPlans, isLoading } = this.props;
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
        {isLoading && <Loader />}
        {backupPlans.length && !isLoading && this.state.expanded.length
          ? backupPlans.map((plan, index) => {
              return (
                plan.backup_plan_id && (
                  <BackupPlan
                    key={index}
                    events={this.props.events}
                    facilities={this.props.facilities}
                    fields={this.props.fields}
                    data={plan}
                    expanded={this.state.expanded[index]}
                    index={index}
                    onToggleOne={this.onToggleOne}
                    deleteBackupPlan={this.props.deleteBackupPlan}
                    updateBackupPlan={this.props.updateBackupPlan}
                  />
                )
              );
            })
          : !isLoading && this.renderEmpty()}
        <Modal isOpen={this.state.isModalOpen} onClose={this.onModalClose}>
          <CreateBackupModal
            onCancel={this.onModalClose}
            events={this.props.events}
            facilities={this.props.facilities}
            fields={this.props.fields}
            saveBackupPlans={this.props.saveBackupPlans}
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
    backupPlans: IBackupPlan[];
    isLoading: boolean;
  };
}

const mapStateToProps = (state: IState) => ({
  events: state.complexities.data,
  facilities: state.complexities.facilities,
  fields: state.complexities.fields,
  backupPlans: state.complexities.backupPlans,
  isLoading: state.complexities.isLoading,
});

const mapDispatchToProps = {
  getEvents,
  getFacilities,
  getFields,
  getBackupPlans,
  saveBackupPlans,
  deleteBackupPlan,
  updateBackupPlan,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamedayComplexities);
