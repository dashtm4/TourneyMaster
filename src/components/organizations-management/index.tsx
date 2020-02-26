import * as React from 'react';
import api from 'api/api';
import { getVarcharEight } from 'helpers';
import { IMember } from 'common/models/member';
import jwt_decode from 'jwt-decode';
import SectionDropdown from '../common/section-dropdown';
import { HeadingLevelThree, HeadingLevelTwo } from 'components/common';
import Button from '../common/buttons/button';
import { Input } from 'components/common';
import styles from './styles.module.scss';

interface IState {
  organizations: any[];
  orgName: string;
  orgTag: string;
  city: string;
  state: string;
  invitationCode: string;
}

class OrganizationsManagement extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      organizations: [],
      orgName: '',
      orgTag: '',
      city: '',
      state: '',
      invitationCode: '',
    };
  }

  componentDidMount() {
    this.getAllAvailableOrganizations();
  }

  async getAllAvailableOrganizations() {
    const organizations = await api.get(`/organizations`);
    this.setState({ organizations });
  }

  async addOrganization() {
    const data = {
      org_name: this.state.orgName,
      org_tag: this.state.orgTag,
      org_id: getVarcharEight(),
      city: this.state.city,
      state: this.state.state,
      is_active_YN: 1,
    };
    await api.post('/organizations', data);
    await this.getAllAvailableOrganizations();
  }

  async applyInvitation() {
    const token = localStorage.getItem('token') || '';
    if (!token) {
      return;
    }
    const decodedToken = jwt_decode(token);
    const { email } = decodedToken as any;
    const members = await api.get(`/members?email_address=${email}`);
    const member: IMember = members.find(
      (it: IMember) => it.email_address === email
    );
    const data = {
      member_id: member.member_id,
      org_id: this.state.invitationCode,
    };
    await api.post('/org_members', data);
    await this.getAllAvailableOrganizations();
  }

  onOrgNameChange(ev: any) {
    this.setState({ orgName: ev.target.value });
  }

  onOrgTagChange(ev: any) {
    this.setState({ orgTag: ev.target.value });
  }

  onInvitationCodeChange(ev: any) {
    this.setState({ invitationCode: ev.target.value });
  }

  onCityChange(ev: any) {
    this.setState({ city: ev.target.value });
  }

  onStateChange(ev: any) {
    this.setState({ state: ev.target.value });
  }

  renderOrganization() {
    const { organizations } = this.state;
    return (
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={true}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Organizations list</span>
        </HeadingLevelThree>
        <div className={styles.listContainer}>
          {organizations.length > 0 && (
            <div>
              <p className={styles.title}>
                You are a part of such organizations:
              </p>
              <ul className={styles.listItem}>
                <li className={styles.title}>#</li>
                <li className={styles.title}>Name</li>
                <li className={styles.title}>Tag</li>
                <li className={styles.title}>City</li>
                <li className={styles.title}>State</li>
                <li className={styles.title}>Invitation Code</li>
              </ul>
            </div>
          )}
          {organizations.map((organization, index) => {
            return (
              <>
                <ul className={styles.listItem}>
                  <li>{`${index + 1}.`}</li>
                  <li>{organization?.org_name}</li>
                  <li>{organization?.org_tag}</li>
                  <li>{organization?.city}</li>
                  <li>{organization?.state}</li>
                  <li>{organization?.org_id}</li>
                </ul>
              </>
            );
          })}
          {organizations.length === 0 && (
            <span className={styles.noFound}>
              Sorry, you are not in organization yet. You can create your own or
              apply invitation from other user.
            </span>
          )}
        </div>
      </SectionDropdown>
    );
  }

  renderNewOrganizationSection() {
    return (
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={true}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Add organization</span>
        </HeadingLevelThree>
        <div className={styles.section}>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="Organization Name"
              value={this.state.orgName || ''}
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(ev: any) => this.onOrgNameChange(ev)}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="Organization Tag"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(ev: any) => this.onOrgTagChange(ev)}
              value={this.state.orgTag || ''}
              startAdornment="@"
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="City"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(ev: any) => this.onCityChange(ev)}
              value={this.state.city || ''}
            />
          </div>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="State"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(ev: any) => this.onStateChange(ev)}
              value={this.state.state || ''}
            />
          </div>
          <div className={styles.sectionItem}>
            <Button
              label="Add organization"
              variant="contained"
              color="primary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.addOrganization()}
            />
          </div>
        </div>
      </SectionDropdown>
    );
  }

  renderApplyInvitation() {
    return (
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={true}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Apply invitation</span>
        </HeadingLevelThree>
        <div className={styles.section}>
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              label="Invitation Code"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={(ev: any) => this.onInvitationCodeChange(ev)}
              value={this.state.invitationCode || ''}
            />
          </div>
          <div className={styles.sectionItem}>
            <Button
              label="Apply invitation"
              variant="contained"
              color="primary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.applyInvitation()}
            />
          </div>
        </div>
      </SectionDropdown>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <HeadingLevelTwo>Organizations Management</HeadingLevelTwo>
        </div>
        {this.renderOrganization()}
        {this.renderNewOrganizationSection()}
        {this.renderApplyInvitation()}
      </div>
    );
  }
}

export default OrganizationsManagement;
