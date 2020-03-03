import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';
import { IOrganization } from 'common/models';
import { Icons } from 'common/constants';
import { getIcon } from 'helpers';
import styles from './styles.module.scss';

interface Props {
  organizations: IOrganization[];
  onCopyToClipboard: (orgId: string) => void;
}

const OrganizationsList = ({ organizations, onCopyToClipboard }: Props) => (
  <SectionDropdown
    type="section"
    useBorder={true}
    isDefaultExpanded={true}
    panelDetailsType="flat"
  >
    <HeadingLevelThree>
      <span>Organizations List</span>
    </HeadingLevelThree>
    <div className={styles.listContainer}>
      {organizations.length > 0 ? (
        <div>
          <p className={styles.description}>
            Organizations to which you currently belong
          </p>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>@Tag</th>
                <th>City</th>
                <th>State</th>
                <th>Invitation Code</th>
                <th></th>
              </tr>
            </thead>
          </table>
          {organizations.map((organization, index) => (
            <tbody>
              <tr className={styles.listItem} key={organization.org_id}>
                <td>{`${index + 1}.`}</td>
                <td>{organization?.org_name}</td>
                <td>{organization?.org_tag}</td>
                <td>{organization?.city}</td>
                <td>{organization?.state}</td>
                <td>
                  <button
                    onClick={() => onCopyToClipboard(organization?.org_id)}
                  >
                    {organization?.org_id}
                    {getIcon(Icons.FILE_COPY)}
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </div>
      ) : (
        <span className={styles.noFound}>
          Sorry, you are not in organization yet. You can create your own or
          apply invitation from other user.
        </span>
      )}
    </div>
  </SectionDropdown>
);

export default OrganizationsList;
