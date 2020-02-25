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
import { BindingAction, BindingCbWithTwo } from 'common/models';

interface IRegistrationEditProps {
  onCancel: BindingAction;
  onSave: BindingAction;
  registration?: IRegistration;
  onChange: BindingCbWithTwo<string, any>;
}

class RegistrationEdit extends React.Component<IRegistrationEditProps, {}> {
  render() {
    return (
      <section>
        <Paper sticky={true}>
          <div className={styles.mainMenu}>
            <div>
              <Button
                label="Cancel"
                variant="text"
                color="secondary"
                onClick={this.props.onCancel}
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
      </section>
    );
  }
}

export default RegistrationEdit;
