import * as React from 'react';
import api from 'api/api';
import TextField from '../common/input/index';
import { getVarcharEight } from 'helpers';
import { IMember } from 'common/models/member';
import jwt_decode from 'jwt-decode';
import SectionDropdown from '../common/section-dropdown/index';
import { HeadingLevelThree } from 'components/common';

interface IState {
  organizations: any[];
  orgName: string;
  orgTag: string;
  invitationCode: string;
}

class OrganizationsManagement extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      organizations: [],
      orgName: '',
      orgTag: '',
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
      city: 'Lviv',
      state: 'UA',
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

  renderOrganization() {
    const { organizations } = this.state;
    return (
      <SectionDropdown type="section" useBorder={true} isDefaultExpanded={true}>
        <HeadingLevelThree>
          <span>Organizations list</span>
        </HeadingLevelThree>
        <div className={'list'}>
          <span>You are a part of such organizations:</span>
          {organizations.map((organization, index) => {
            return (
              <>
                <div>
                  {`${index + 1}.`}
                  {organization?.org_name}
                  {organization?.org_tag}
                  {organization?.city}
                  {organization?.state}
                </div>
                <div>{`InvitationCode: ${organization?.org_id}`}</div>
              </>
            );
          })}
          {organizations.length === 0 && (
            <span>
              Sorry, you are not in organization yet. You can create your own or
              apply invitation from other user
            </span>
          )}
        </div>
      </SectionDropdown>
    );
  }

  renderNewOrganizationSection() {
    return (
      <SectionDropdown type="section" useBorder={true} isDefaultExpanded={true}>
        <HeadingLevelThree>
          <span>Add organization</span>
        </HeadingLevelThree>
        <div className={'input'}>
          <TextField
            // tslint:disable-next-line: jsx-no-lambda
            onChange={(ev: any) => this.onOrgNameChange(ev)}
            value={this.state.orgName || ''}
            name={'Organization Name'}
            placeholder={'Organization Name'}
            width={'100%'}
          />
          <TextField
            // tslint:disable-next-line: jsx-no-lambda
            onChange={(ev: any) => this.onOrgTagChange(ev)}
            value={this.state.orgTag || ''}
            startAdornment="@"
            name={'Organization Tag'}
            placeholder={'Organization tag'}
            width={'100%'}
          />
          <button
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => this.addOrganization()}
          >
            Add organization
          </button>
        </div>
      </SectionDropdown>
    );
  }

  renderApplyInvitation() {
    return (
      <SectionDropdown type="section" useBorder={true} isDefaultExpanded={true}>
        <HeadingLevelThree>
          <span>Apply invitation</span>
        </HeadingLevelThree>
        <div className={'invitation apply'}>
          <TextField
            // tslint:disable-next-line: jsx-no-lambda
            onChange={(ev: any) => this.onInvitationCodeChange(ev)}
            value={this.state.invitationCode || ''}
            name={'Organization Tag'}
            placeholder={'Put your invitation code here'}
            width={'100%'}
          />
          <button
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => this.applyInvitation()}
          >
            Apply invitation
          </button>
        </div>
      </SectionDropdown>
    );
  }

  render() {
    return (
      <div className={'root'}>
        {this.renderOrganization()}
        {this.renderNewOrganizationSection()}
        {this.renderApplyInvitation()}
      </div>
    );
  }
}

export default OrganizationsManagement;
