import React from 'react';
import {
  SectionDropdown,
  HeadingLevelThree,
  Toasts,
  Button,
} from 'components/common';
import PopupDeleteOrganization from '../popup-delete-organization';
import { IOrganization } from 'common/models';
import { Icons } from 'common/constants';
import { getIcon } from 'helpers';
import styles from './styles.module.scss';

const COPY_ICON_STYLES = {
  height: '23px',
  marginLeft: '10px',
};

interface Props {
  organizations: IOrganization[];
}

const copyToClipboard = (id: string) => {
  const tempInput = document.createElement('input');
  tempInput.value = id;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  Toasts.successToast('The invitation code was successfully copied');
};

const OrganizationsList = ({ organizations }: Props) => {
  const [configOrg, onDeletePopup] = React.useState<null | IOrganization>(null);

  return (
    <>
      <SectionDropdown
        type="section"
        useBorder={true}
        isDefaultExpanded={true}
        panelDetailsType="flat"
      >
        <HeadingLevelThree>
          <span>Organizations List</span>
        </HeadingLevelThree>
        <div className={styles.sectWrapper}>
          {organizations.length > 0 ? (
            <>
              <p className={styles.description}>
                Organizations to which you currently belong
              </p>
              <div className={styles.orgTableWrapper}>
                <table className={styles.orgTable}>
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

                  <tbody>
                    {organizations
                      .sort((a, b) => (a.org_name > b.org_name ? 1 : -1))
                      .map((organization, index) => (
                        <tr
                          className={styles.listItem}
                          key={organization.org_id}
                        >
                          <td>{`${index + 1}.`}</td>
                          <td>{organization.org_name}</td>
                          <td>{organization.org_tag}</td>
                          <td>{organization.city}</td>
                          <td>{organization.state}</td>
                          <td>
                            <button
                              className={styles.codeBtn}
                              onClick={() =>
                                copyToClipboard(organization?.org_id)
                              }
                            >
                              {organization.org_id}
                              {getIcon(Icons.FILE_COPY, COPY_ICON_STYLES)}
                            </button>
                          </td>
                          <td>
                            <span className={styles.delBtnWrapper}>
                              <Button
                                onClick={() => onDeletePopup(organization)}
                                icon={getIcon(Icons.DELETE)}
                                label="Delete"
                                variant="text"
                                color="inherit"
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <span className={styles.noFound}>
              Sorry, you are not in organization yet. You can create your own or
              apply invitation from other user.
            </span>
          )}
        </div>
      </SectionDropdown>
      {configOrg && (
        <PopupDeleteOrganization
          deleteTitle={configOrg.org_name}
          isOpen={Boolean(configOrg)}
          onClose={() => onDeletePopup(null)}
          onCancelClick={() => onDeletePopup(null)}
          onDeleteClick={() => {}}
        />
      )}
    </>
  );
};

export default OrganizationsList;
