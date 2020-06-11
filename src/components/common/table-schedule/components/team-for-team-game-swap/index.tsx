import React, { useState } from 'react';
import { IDivision, ISchedulesDetails } from 'common/models';
import Select from 'components/common/select';
import { ITeam } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import { Button } from 'components/common';

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  schedulesDetails: ISchedulesDetails[];
  updateSchedulesDetails: (
    modifiedSchedulesDetails: ISchedulesDetails[],
    schedulesDetailsToModify: ISchedulesDetails[]
  ) => void;
}

const TeamForTeamGameSwap = ({ divisions, teams, schedulesDetails, updateSchedulesDetails }: Props) => {
  const [selectedDivisionID, setSelectedDivisionID] = useState('');
  const [selectedDivisionTeams, setSelectedDivisionTeams] = useState<ITeam[]>(
    []
  );
  const [selectedFirstTeamID, setSelectedFirstTeamID] = useState('');
  const [selectedSecondTeamID, setSelectedSecondTeamID] = useState('');

  const onDivisionChange = async (e: any) => {
    const selectedDivisionIDFromSelect = e.target.value;
    setSelectedDivisionID(selectedDivisionIDFromSelect);
    setSelectedDivisionTeams(
      teams.filter(v => v.divisionId === selectedDivisionIDFromSelect)
    );
  };

  const onTeamChange = (setTeamID: any, anotherTeamID: string) => {
    return (e: any) => {
      const selectedTeamID = e.target.value;
      if (selectedTeamID !== anotherTeamID) {
        setTeamID(selectedTeamID);
      }
    }
  };

  const mapTeamsForSelect = (selectedTeamID: string) => {
    return selectedDivisionTeams
      .map(v => ({ value: v.id, label: v.name }))
      .filter(v => v.value !== selectedTeamID);
  };

  const swapTeams = () => {
    const modifiedSchedulesDetails = schedulesDetails?.map(v => {
        const scheduleDetails = { ...v };

        if (scheduleDetails.division_id === selectedDivisionID) {
          if (scheduleDetails.home_team_id === selectedFirstTeamID) {
            scheduleDetails.home_team_id = selectedSecondTeamID;
          } else if (scheduleDetails.home_team_id === selectedSecondTeamID) {
            scheduleDetails.home_team_id = selectedFirstTeamID;
          }

          if (scheduleDetails.away_team_id === selectedFirstTeamID) {
            scheduleDetails.away_team_id = selectedSecondTeamID;
          } else if (scheduleDetails.away_team_id === selectedSecondTeamID) {
            scheduleDetails.away_team_id = selectedFirstTeamID;
          }
        }

        return scheduleDetails;
      }) || [];

    const schedulesDetailsToModify = modifiedSchedulesDetails?.filter(
      v => v.division_id === selectedDivisionID && (v.home_team_id === selectedFirstTeamID || v.away_team_id === selectedSecondTeamID || v.home_team_id === selectedSecondTeamID || v.away_team_id === selectedFirstTeamID)
    );

    // console.log(selectedFirstTeamID, selectedSecondTeamID);
    // console.log(schedulesDetails?.filter(
    //   v => v.division_id === selectedDivisionID && (v.home_team_id === selectedFirstTeamID || v.away_team_id === selectedSecondTeamID || v.home_team_id === selectedSecondTeamID || v.away_team_id === selectedFirstTeamID)
    // ));

    // console.log(schedulesDetailsToModify);

    updateSchedulesDetails(modifiedSchedulesDetails, schedulesDetailsToModify);
  };

  return (
    <div className={styles.container}>
      <Select
        options={divisions.map(v => {
          return { value: v.division_id, label: v.short_name };
        })}
        value={selectedDivisionID || ''}
        placeholder="Select Division"
        onChange={onDivisionChange}
      />
      <div className={styles.teamsSelection}>
        <div className={styles.teamSelectWrapper}>
          <Select
            options={mapTeamsForSelect(selectedSecondTeamID)}
            value={selectedFirstTeamID}
            placeholder="Select first team"
            onChange={onTeamChange(setSelectedFirstTeamID, selectedSecondTeamID)}
            disabled={!selectedDivisionID}
          />
        </div>

        <Button
          btnStyles={{
            backgroundColor: '#1C315F',
            color: '#fff',
            marginTop: '2px',
          }}
          label="Swap"
          variant="text"
          color="default"
          disabled={!(selectedFirstTeamID && selectedSecondTeamID)}
          onClick={swapTeams}
        >
          Swap
        </Button>

        <div className={styles.teamSelectWrapper}>
          <Select
            options={mapTeamsForSelect(selectedFirstTeamID)}
            value={selectedSecondTeamID}
            placeholder="Select second team"
            onChange={onTeamChange(setSelectedSecondTeamID, selectedFirstTeamID)}
            disabled={!selectedDivisionID}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamForTeamGameSwap;
