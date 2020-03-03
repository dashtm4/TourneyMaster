import * as React from 'react';
import api from 'api/api';
import { getVarcharEight } from 'helpers';
import { IMember } from 'common/models/member';
import jwt_decode from 'jwt-decode';
import {
  HeadingLevelThree,
  HeadingLevelTwo,
  Toasts,
  SectionDropdown,
  Button,
  Input,
  CardMessage,
} from 'components/common';
import { Icons } from 'common/constants';
import OrganizationsList from './components/organizations-list';
import styles from './styles.module.scss';

const CARD_MESSAGE_STYLES = {
  marginBottom: '20px',
};

interface IState {
  organizations: any[];
  orgName: string | null;
  orgTag: string | null;
  city: string | null;
  state: string | null;
  invitationCode: string | null;
}

class OrganizationsManagement extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      organizations: [],
      orgName: null,
      orgTag: null,
      city: null,
      state: null,
      invitationCode: null,
    };
  }

  componentDidMount() {
    this.getAllAvailableOrganizations();
  }

  async getAllAvailableOrganizations() {
    const organizations = await api.get(`/organizations`);
    this.setState({ organizations });
  }

  async addOrganization(evt: React.SyntheticEvent) {
    evt.preventDefault();

    const orgId = getVarcharEight();
    const data = {
      org_name: this.state.orgName,
      org_tag: this.state.orgTag,
      org_id: orgId,
      city: this.state.city,
      state: this.state.state,
      is_active_YN: 1,
    };

    await api.post('/organizations', data);

    await this.addUserToOrg(orgId);

    await this.getAllAvailableOrganizations();
  }

  async addUserToOrg(orgId?: string) {
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
      org_member_id: getVarcharEight(),
      org_id: orgId || this.state.invitationCode,
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

  copyToClipboard(id: string) {
    const tempInput = document.createElement('input');
    tempInput.value = id;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    Toasts.successToast('The invitation code was successfully copied');
  }

  renderNewOrganizationSection() {
    return (
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={false}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Create Organization</span>
        </HeadingLevelThree>
        <div className={styles.section}>
          <CardMessage type={Icons.EMODJI_OBJECTS} style={CARD_MESSAGE_STYLES}>
            Create a common calendar where you and your organization’s
            collaborators can see each others notes, requests, tasks, and
            reminders.
          </CardMessage>
          <form onSubmit={evt => this.addOrganization(evt)}>
            <div className={styles.sectionItem}>
              <Input
                fullWidth={true}
                label="Organization Name"
                value={this.state.orgName || ''}
                // tslint:disable-next-line: jsx-no-lambda
                onChange={(ev: any) => this.onOrgNameChange(ev)}
                isRequired
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
                label="Add Organization"
                btnType="submit"
                variant="contained"
                color="primary"
              />
            </div>
          </form>
        </div>
      </SectionDropdown>
    );
  }

  renderApplyInvitation() {
    return (
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={false}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Apply Invitation</span>
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
              label="Apply Invitation"
              variant="contained"
              color="primary"
              // tslint:disable-next-line: jsx-no-lambda
              onClick={() => this.addUserToOrg()}
            />
          </div>
        </div>
      </SectionDropdown>
    );
  }

  render() {
    const { organizations } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <HeadingLevelTwo>Organizations Management</HeadingLevelTwo>
        </div>
        <OrganizationsList
          organizations={organizations}
          onCopyToClipboard={this.copyToClipboard}
        />
        {this.renderNewOrganizationSection()}
        {this.renderApplyInvitation()}
      </div>
    );
  }
}

export default OrganizationsManagement;
