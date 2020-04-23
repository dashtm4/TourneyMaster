import React from 'react';
import HeadingLevelTwo from '../../common/headings/heading-level-two';
import Button from '../../common/buttons/button';
import SectionDropdown from '../../common/section-dropdown';
import styles from './styles.module.scss';
import Paper from '../../common/paper';
import PrimaryInformation from './primary-information';
import TeamsAthletesInfo from './teams-athletes';
import MainContact from './main-contact';
import { IRegistration } from 'common/models/registration';
import { BindingAction, BindingCbWithTwo, IDivision } from 'common/models';
import { PopupExposure } from 'components/common';

interface IRegistrationEditProps {
  onCancel: BindingAction;
  onSave: BindingAction;
  registration?: IRegistration;
  onChange: BindingCbWithTwo<string, any>;
  changesAreMade: boolean;
  divisions: IDivision[];
  eventType: string;
}

interface IRegistrationEditState {
  isExposurePopupOpen: boolean;
}

class RegistrationEdit extends React.Component<
  IRegistrationEditProps,
  IRegistrationEditState
> {
  state = { isExposurePopupOpen: false };

  onModalClose = () => {
    this.setState({ isExposurePopupOpen: false });
  };

  onCancelClick = () => {
    if (this.props.changesAreMade) {
      this.setState({ isExposurePopupOpen: true });
    } else {
      this.props.onCancel();
    }
  };

  render() {
    return (
      <section>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div className={styles.btnsWrapper}>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.onCancelClick}
              />
              <Button
                label="Save"
                variant="contained"
                color="primary"
                onClick={this.props.onSave}
              />
            </div>
          </div>
        </Paper>
        <div className={styles.sectionContainer}>
          <div className={styles.heading}>
            <HeadingLevelTwo>Registration</HeadingLevelTwo>
          </div>
          <ul className={styles.libraryList}>
            <li>
              <SectionDropdown
                type="section"
                panelDetailsType="flat"
                isDefaultExpanded={true}
              >
                <span>Primary Information</span>
                <PrimaryInformation
                  data={this.props.registration}
                  onChange={this.props.onChange}
                />
              </SectionDropdown>
            </li>
            <li>
              <SectionDropdown
                type="section"
                panelDetailsType="flat"
                isDefaultExpanded={true}
              >
                <span>Teams & Athletes</span>
                <TeamsAthletesInfo
                  data={this.props.registration}
                  onChange={this.props.onChange}
                  eventType={this.props.eventType}
                />
              </SectionDropdown>
            </li>
            <li>
              <SectionDropdown
                type="section"
                panelDetailsType="flat"
                isDefaultExpanded={true}
              >
                <span>Main Contact</span>
                <MainContact
                  data={this.props.registration}
                  onChange={this.props.onChange}
                />
              </SectionDropdown>
            </li>
          </ul>
        </div>
        <PopupExposure
          isOpen={this.state.isExposurePopupOpen}
          onClose={this.onModalClose}
          onExitClick={this.props.onCancel}
          onSaveClick={this.props.onSave}
        />
      </section>
    );
  }
}

export default RegistrationEdit;
