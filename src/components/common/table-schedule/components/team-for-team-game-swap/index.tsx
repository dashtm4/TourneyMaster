import React, { useState } from 'react';
import { IDivision, ISchedulesDetails } from 'common/models';
import Select from 'components/common/select';
import { ITeam } from 'common/models/schedule/teams';
import styles from './styles.module.scss';
import { Button } from 'components/common';

interface Props {
  divisions: IDivision[];
  teams: ITeam[];
  schedulesDetails: ISchedulesDetails[] | undefined;
}

const TeamForTeamGameSwap = ({ divisions, teams, schedulesDetails }: Props) => {
  const [selectedDivisionID, setSelectedDivisionID] = useState('');
  const [selectedDivisionTeams, setSelectedDivisionTeams] = useState<ITeam[]>(
    []
  );
  const [selectedFirstTeamID, setSelectedFirstTeamID] = useState('');
  const [selectedSecondTeamID, setSelectedSecondTeamID] = useState('');

  console.log(schedulesDetails);
  // useEffect(() => {
  //   if (schedulesDetails) {
  //     console.log(schedulesDetails.map(v => v.game_date));
  //     console.log("teams", selectedFirstTeamID, selectedSecondTeamID);
  //     console.log("source", schedulesDetails.filter((v) => v.division_id && ((v.home_team_id === selectedFirstTeamID || v.away_team_id === selectedSecondTeamID) || (v.home_team_id === selectedSecondTeamID || v.away_team_id === selectedFirstTeamID))));
  //     console.log("swapped", schedulesDetails
  //       .filter((v) => v.division_id && ((v.home_team_id === selectedFirstTeamID || v.away_team_id === selectedSecondTeamID) || (v.home_team_id === selectedSecondTeamID || v.away_team_id === selectedFirstTeamID)))
  //       .map((v) => {
  //         const c = { ...v };
  //         if (c.home_team_id === selectedFirstTeamID) {
  //           c.home_team_id = selectedSecondTeamID;
  //         } else if (v.home_team_id === selectedSecondTeamID) {
  //           c.home_team_id = selectedFirstTeamID;
  //         }

  //         if (c.away_team_id === selectedFirstTeamID) {
  //           c.away_team_id = selectedSecondTeamID;
  //         } else if (v.away_team_id === selectedSecondTeamID) {
  //           c.away_team_id = selectedFirstTeamID;
  //         }

  //         return c;
  //       }));
  //   }
  // }, [selectedDivisionID, selectedFirstTeamID, selectedSecondTeamID]);

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
