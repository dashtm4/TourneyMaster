/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  MenuTitles,
} from 'common/enums';
import { BindingAction, BindingCbWithOne } from 'common/models';
import {
  HeadingLevelTwo,
  Select,
  Loader,
  Input,
  SectionDropdown,
} from 'components/common';
import { AppState } from './logic/reducer';
import { getOrgInfo, getStatesGroup, save } from './logic/actions';
import { Navigation } from './navigation';
import styles from './styles.module.scss';
import { FormControlLabel, RadioGroup, Radio as MuiRadio, } from '@material-ui/core';

interface StateGroup {
  label: string;
  value: string;
}

interface IProps {
  orgList: Array<any>;
  isLoading: boolean;
  stateGroup: Array<StateGroup>;
  getOrgInfo: BindingAction;
  save: BindingCbWithOne<any>;
  getStatesGroup: BindingAction;
}

interface IState {
  orgList: Array<any>;
}

class OrganizationInfo extends Component<IProps, IState> {
  state: IState = {
    orgList: [],
  }

  componentDidMount() {
    const { getOrgInfo, getStatesGroup } = this.props;
    getOrgInfo();
    getStatesGroup();
  }

  componentDidUpdate(prevProps: IProps) {
    const { orgList, isLoading } = this.props;

    if (isLoading !== prevProps.isLoading) {
      this.setState({
        orgList,
      });

    }
    console.log(this.state.orgList);
  }

  handleSave = () => {
    const { save } = this.props;
    const { orgList } = this.state;

    save(orgList);
  }

  onChange = (value: any, id: string, field: string) => {
    const { orgList } = this.state;
    const newOrgList = orgList.map(el => {
      if (el.org_id === id) {
        return {
          ...el,
          [field]: value,
        }
      }
      return el;
    });
    this.setState({
      orgList: newOrgList
    });
    console.log(newOrgList);
  }

  render() {
    const { isLoading, orgList, stateGroup } = this.props;

    if (isLoading || !orgList) {
      return <Loader />;
    }
    return (
      <section className={styles.container}>
        <Navigation onSave={this.handleSave} />

        <div className={styles.sectionContainer}>
          <div className={styles.headingContainer}>
            <HeadingLevelTwo>Utilities</HeadingLevelTwo>
          </div>
          <ul className={styles.organizationList}>
            {this.state.orgList.map((org: any, index: number) => (
              <li key={index}>
                <SectionDropdown
                  id={MenuTitles.ORG_INFO}
                  panelDetailsType="flat"
                  isDefaultExpanded={true}
                >
                  <div className={styles.sectionTitle}>
                    Organization Info
                </div>
                  <div className={styles.sectionContent}>
                    <div className={styles.orgInfo}>
                      <fieldset className={styles.orgName}>
                        <Input
                          onChange={(evt: any) => this.onChange(evt.target.value, org.org_id, 'org_name')}
                          value={org.org_name || ''}
                          label="Org Name"
                          fullWidth={true}
                        />
                      </fieldset>
                      <fieldset className={styles.orgCity}>
                        <Input
                          onChange={(evt: any) => this.onChange(evt.target.value, org.org_id, 'city')}
                          value={org.city || ''}
                          label="City"
                          fullWidth={true}
                        />
                      </fieldset>
                      <fieldset className={styles.orgState}>
                        <Select
                          options={stateGroup}
                          label="State *"
                          value={org.state || ''}
                          onChange={(evt: any) => this.onChange(evt.target.value, org.org_id, 'state')}
                          isRequired={true}
                        />
                      </fieldset>
                    </div>
                    <div className={styles.subSectionTitle}>
                      Merchant Payment Accounts
                  </div>
                    <div className={styles.subSectionContainer}>
                      <RadioGroup>
                        {/* stripe */}
                        <div className={styles.radioButtonGroup}>
                          <FormControlLabel
                            value={org.is_default_YN === 1}
                            control={<MuiRadio checked={org.is_default_YN === 1} color="secondary" />}
                            label="Stripe Connect ID"
                            onChange={() => this.onChange(1, org.org_id, 'is_default_YN')}
                          />
                          <Input
                            onChange={(evt: any) => this.onChange(evt.target.value, org.org_id, 'stripe_connect_id')}
                            value={org.stripe_connect_id || ''}
                            fullWidth={true}
                          />
                        </div>
                        {/* authdotnet */}
                        <div className={styles.radioButtonGroup}>
                          <FormControlLabel
                            value={org.is_default_YN === 2}
                            control={<MuiRadio checked={org.is_default_YN === 2} color="secondary" />}
                            label="Authorize.Net"
                            onChange={() => this.onChange(2, org.org_id, 'is_default_YN')}
                          />
                          <Input
                            onChange={(evt: any) => this.onChange(evt.target.value, org.org_id, 'authdotnet_id')}
                            value={org.authdotnet_id || ''}
                            fullWidth={true}
                          />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </SectionDropdown>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
};

interface IRootState {
  orgInfo: AppState;
}

export default connect(
  ({ orgInfo }: IRootState) => ({
    isLoading: orgInfo.isLoading,
    orgList: orgInfo.orgList,
    stateGroup: orgInfo.stateGroup,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        getOrgInfo,
        getStatesGroup,
        save,
      },
      dispatch
    )
)(OrganizationInfo);
