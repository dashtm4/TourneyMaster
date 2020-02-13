import React from 'react';
import HeadingLevelThree from '../../../common/headings/heading-level-three';
import Button from '../../../common/buttons/button';
import { getIcon } from '../../../../helpers/get-icon.helper';
import { ITeam } from '../../../../common/models/teams';
import { Icons } from '../../../../common/constants/icons';
import styles from './styles.module.scss';

interface Props {
  team: ITeam | null;
}

const EDIT_ICON_STYLES = {
  marginRight: '5px',
};

const TeamDetailsPopup = ({ team }: Props) => {
  if (!team) return null;

  return (
    <div className={styles.popupWrapper}>
      <div className={styles.headerWrapper}>
        <HeadingLevelThree color="#1C315F">
          <span>Big 4 HHH (2020, West)</span>
        </HeadingLevelThree>
        <Button
          icon={getIcon(Icons.EDIT, EDIT_ICON_STYLES)}
          label="Edit Team Details"
          variant="text"
          color="secondary"
        />
      </div>
      <p>{team.long_name + team.team_id}</p>
      <form autoComplete="off">
        <div className=""></div>
      </form>
    </div>
  );
};
export default TeamDetailsPopup;
