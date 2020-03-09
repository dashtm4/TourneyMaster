import React, { Component } from 'react';
import SchedulesMatrix from './matrix';
import { calculateTimeSlots } from './helper';
import api from 'api/api';
import { mapTeamsData, mapFieldsData } from './mapTournamentData';
import { IFetchedTeam, ITeam } from 'common/models/schedule/teams';
import { IFetchedDivision } from 'common/models/schedule/divisions';
import { IFacility } from 'common/models/facilities';
import { IField } from 'common/models/schedule/fields';
import { IField as IFetchedField } from 'common/models/field';

export interface ITimeSlot {
  id: number;
  time: string;
}

// const fields: IField[] = [
//   {
//     id: 0,
//     facilityId: 0,
//     name: 'Field 0',
//     isPremier: true,
//   },
//   {
//     id: 1,
//     facilityId: 0,
//     name: 'Field 1',
//     isPremier: true,
//   },
//   {
//     id: 2,
//     facilityId: 0,
//     name: 'Field 2',
//     isPremier: false,
//   },
//   {
//     id: 3,
//     facilityId: 0,
//     name: 'Field 3',
//     isPremier: false,
//   },
//   {
//     id: 4,
//     facilityId: 0,
//     name: 'Field 4',
//     isPremier: false,
//   },
//   {
//     id: 5,
//     facilityId: 0,
//     name: 'Field 5',
//     isPremier: false,
//   },
//   {
//     id: 6,
//     facilityId: 0,
//     name: 'Field 6',
//     isPremier: false,
//   },
//   {
//     id: 7,
//     facilityId: 1,
//     name: 'Field 7',
//     isPremier: false,
//   },
//   {
//     id: 8,
//     facilityId: 1,
//     name: 'Field 8',
//     isPremier: false,
//   },
// ];

// POOLS 'A1', 'B2', 'C3', 'D4', E5, F6

// const teams: ITeam[] = [
//   {
//     id: 0,
//     name: 'Team # 1',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'A1',
//     isPremier: false,
//   },
//   {
//     id: 1,
//     name: 'Team # 2',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'A1',
//     isPremier: false,
//   },
//   {
//     id: 2,
//     name: 'Team # 3',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'A1',
//     isPremier: false,
//   },
//   {
//     id: 3,
//     name: 'Team # 4',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'A1',
//     isPremier: false,
//   },
//   {
//     id: 4,
//     name: 'Team # 5',
//     startTime: '02/02/2020 09:00:00',
//     divisionId: 0,
//     poolId: 'B2',
//     isPremier: false,
//   },
//   {
//     id: 5,
//     name: 'Team # 6',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'B2',
//     isPremier: false,
//   },
//   {
//     id: 6,
//     name: 'Team # 7',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'B2',
//     isPremier: false,
//   },
//   {
//     id: 7,
//     name: 'Team # 8',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'B2',
//     isPremier: false,
//   },
//   {
//     id: 8,
//     name: 'Team # 9',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'C3',
//     isPremier: false,
//   },
//   {
//     id: 9,
//     name: 'Team # 10',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'C3',
//     isPremier: false,
//   },
//   {
//     id: 10,
//     name: 'Team # 11',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'C3',
//     isPremier: false,
//   },
//   {
//     id: 11,
//     name: 'Team # 12',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'C3',
//     isPremier: false,
//   },
//   {
//     id: 12,
//     name: 'Team # 13',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   {
//     id: 13,
//     name: 'Team # 14',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   {
//     id: 14,
//     name: 'Team # 15',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   {
//     id: 15,
//     name: 'Team # 16',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   {
//     id: 16,
//     name: 'Team # 17',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   {
//     id: 17,
//     name: 'Team # 18',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'D4',
//     isPremier: false,
//   },
//   // PREMIER POOL 1
//   {
//     id: 18,
//     name: 'Team # 19',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'E5',
//     isPremier: true,
//   },
//   {
//     id: 19,
//     name: 'Team # 20',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'E5',
//     isPremier: true,
//   },
//   {
//     id: 20,
//     name: 'Team # 21',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'E5',
//     isPremier: true,
//   },
//   {
//     id: 21,
//     name: 'Team # 22',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'E5',
//     isPremier: true,
//   },
//   // PREMIER POOL 2
//   {
//     id: 22,
//     name: 'Team # 23',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'F6',
//     isPremier: true,
//   },
//   {
//     id: 23,
//     name: 'Team # 24',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'F6',
//     isPremier: true,
//   },
//   {
//     id: 24,
//     name: 'Team # 25',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'F6',
//     isPremier: true,
//   },
//   {
//     id: 25,
//     name: 'Team # 26',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 0,
//     poolId: 'F6',
//     isPremier: true,
//   },
//   // ANOTHER DIVISION
//   {
//     id: 26,
//     name: 'Team # 27',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 1,
//     poolId: 'G7',
//     isPremier: false,
//   },
//   {
//     id: 27,
//     name: 'Team # 28',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 1,
//     poolId: 'G7',
//     isPremier: false,
//   },
//   {
//     id: 28,
//     name: 'Team # 29',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 1,
//     poolId: 'G7',
//     isPremier: false,
//   },
//   {
//     id: 29,
//     name: 'Team # 30',
//     startTime: '02/02/2020 08:00:00',
//     divisionId: 1,
//     poolId: 'G7',
//     isPremier: false,
//   },
// ];

interface IState {
  timeSlots?: ITimeSlot[];
  teams?: ITeam[];
  fields?: IField[];
}

class Schedules extends Component<{}, IState> {
  state: IState = {};

  async componentDidMount() {
    const firstGameTime = '08:00:00';
    const lastGameEnd = '16:00:00';
    const totalGameTime = 60;

    const timeSlots = calculateTimeSlots(
      firstGameTime,
      lastGameEnd,
      totalGameTime
    );

    this.setState({ timeSlots });

    const fetchedTeams: IFetchedTeam[] = await api.get(
      '/teams?event_id=ADLNT001'
    );
    const fetchedDivisions: IFetchedDivision[] = await api.get(
      '/divisions?event_id=ADLNT001'
    );

    const fetchedFacilities: IFacility[] = await api.get(
      '/facilities?event_id=ADLNT001'
    );

    const fetchedFields: IFetchedField[] = [];
    await Promise.all(
      fetchedFacilities.map(async ff => {
        const fields = await api.get(
          `/fields?facilities_id=${ff.facilities_id}`
        );
        if (fields?.length) fetchedFields.push(...fields);
      })
    );

    const mappedTeams: ITeam[] = mapTeamsData(
      fetchedTeams,
      fetchedDivisions
    ).slice(0, 60);

    const mappedFields: IField[] = mapFieldsData(fetchedFields);

    this.setState({
      teams: mappedTeams,
      fields: mappedFields,
    });
  }

  render() {
    const { timeSlots, teams, fields } = this.state;

    return (
      <div>
        {teams?.length && timeSlots?.length && fields?.length && (
          <SchedulesMatrix
            timeSlots={timeSlots}
            fields={fields}
            teams={teams}
          />
        )}
      </div>
    );
  }
}

export default Schedules;
