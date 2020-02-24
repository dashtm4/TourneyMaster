import React, { useState } from 'react';
import { HeadingLevelThree, Button } from '../../common';
import FieldItem from './components/field-item';
import { getIcon } from '../../../helpers/get-icon.helper';
import { BindingAction } from '../../../common/models/callback';
import { ITeam } from '../../../common/models/teams';
import { Icons } from '../../../common/constants/icons';
import styles from './styles.module.scss';

const EDIT_ICON_STYLES = {
  marginRight: '5px',
};

const DELETE_ICON_STYLES = {
  marginRight: '5px',
  fill: '#FF0F19',
};

enum FORM_FIELDS {
  LONG_NAME = 'long_name',
  SHORT_NAME = 'short_name',
  TEAM_TAG = 'team_tag',
  STATE = 'state',
  CITY = 'city',
  CONTACT_FIRST_NAME = 'contact_first_name',
  CONTACT_LAST_NAME = 'contact_last_name',
  PHONE_NUM = 'phone_num',
  CONCTACT_EMAIL = 'contact_email',
}

interface Props {
  team: ITeam | null;
  onSaveTeamClick: BindingAction;
  onDeleteTeamClick: (team: ITeam) => void;
  onChangeTeam: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onCloseModal: BindingAction;
}

const TeamDetailsPopup = ({
  team,
  onSaveTeamClick,
  onDeleteTeamClick,
  onChangeTeam,
  onCloseModal,
}: Props) => {
  const [isEdit, onEditClick] = useState(false);
  const [teamTitle] = useState(team?.long_name);

  if (!team) {
    return null;
  }

  // const teamTitle = team?.long_name;;

  return (
    <div className={styles.popupWrapper}>
      <div className={styles.headerWrapper}>
        <HeadingLevelThree color="#1C315F">
          <span>{teamTitle} (2020, West)</span>
        </HeadingLevelThree>
        <Button
          onClick={() => onEditClick(!isEdit)}
          icon={getIcon(Icons.EDIT, EDIT_ICON_STYLES)}
          label="Edit Team Details"
          variant="text"
          color="secondary"
        />
      </div>
      <form autoComplete="off">
        <div className={styles.popupFormWrapper}>
          <div className={styles.mainInfo}>
            <ul className={styles.infoList}>
              <li>
                <b>Long Name: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.long_name || ''}
                      name={FORM_FIELDS.LONG_NAME}
                      type="text"
                    />
                    <span className="visually-hidden">Long Name</span>
                  </label>
                ) : (
                  <span>{team.long_name}</span>
                )}
              </li>
              <li>
                <b>Short name: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.short_name || ''}
                      name={FORM_FIELDS.SHORT_NAME}
                      type="text"
                    />
                    <span className="visually-hidden">Short name:</span>
                  </label>
                ) : (
                  <span>{team.short_name}</span>
                )}
              </li>
              <li>
                <b>Tag: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.team_tag || ''}
                      name={FORM_FIELDS.TEAM_TAG}
                      type="text"
                    />
                    <span className="visually-hidden">Tag</span>
                  </label>
                ) : (
                  <span>{team.team_tag}</span>
                )}
              </li>
              <li>
                <b>State: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.state || ''}
                      name={FORM_FIELDS.STATE}
                      type="text"
                    />
                    <span className="visually-hidden">State</span>
                  </label>
                ) : (
                  <span>{team.state}</span>
                )}
              </li>
              <li>
                <b>City: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.city || ''}
                      name={FORM_FIELDS.CITY}
                      type="text"
                    />
                    <span className="visually-hidden">City</span>
                  </label>
                ) : (
                  <span>{team.city}</span>
                )}
              </li>
            </ul>
            <ul className={styles.contactList}>
              <li className={styles.contactListDouble}>
                <b>Contact: </b>
                {isEdit ? (
                  <p>
                    <label>
                      <b>First Name: </b>
                      <input
                        onChange={onChangeTeam}
                        value={team.contact_first_name || ''}
                        name={FORM_FIELDS.CONTACT_FIRST_NAME}
                        type="text"
                      />
                    </label>
                    <label>
                      <b>Last Name: </b>
                      <input
                        onChange={onChangeTeam}
                        value={team.contact_last_name || ''}
                        name={FORM_FIELDS.CONTACT_LAST_NAME}
                        type="text"
                      />
                    </label>
                  </p>
                ) : (
                  <span>{`${team.contact_first_name} ${team.contact_last_name}`}</span>
                )}
              </li>
              <li>
                <b>Mobile: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.phone_num || ''}
                      name={FORM_FIELDS.PHONE_NUM}
                      type="text"
                    />
                    <span className="visually-hidden">Mobile number</span>
                  </label>
                ) : (
                  <span>{team.phone_num}</span>
                )}
              </li>
              <li>
                <b>Email: </b>
                {isEdit ? (
                  <label>
                    <input
                      onChange={onChangeTeam}
                      value={team.contact_email || ''}
                      name={FORM_FIELDS.CONCTACT_EMAIL}
                      type="text"
                    />
                    <span className="visually-hidden">Email</span>
                  </label>
                ) : (
                  <span>{team.contact_email}</span>
                )}
              </li>
            </ul>
          </div>
          <ul className={styles.fieldList}>
            <FieldItem />
          </ul>
        </div>
        <div className={styles.btnsWrapper}>
          <span className={styles.BtnDeleteWrapper}>
            <Button
              onClick={() => onDeleteTeamClick(team)}
              icon={getIcon(Icons.DELETE, DELETE_ICON_STYLES)}
              label="Delete Team"
              variant="text"
              color="inherit"
            />
          </span>
          <p className={styles.popupBtnsWrapper}>
            <Button
              onClick={onCloseModal}
              label="Cancel"
              variant="text"
              color="secondary"
            />
            <Button
              onClick={onSaveTeamClick}
              label="Save"
              variant="contained"
              color="primary"
            />
          </p>
        </div>
      </form>
    </div>
  );
};
export default TeamDetailsPopup;
