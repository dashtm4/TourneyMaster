import React, { Component } from 'react';
import SchedulesMatrix from './matrix';
import { calculateTimeSlots } from './helper';

export interface IField {
  id: number;
  facilityId: number;
  name: string;
  isPremier: boolean;
}

export interface ITeam {
  id: number;
  name: string;
  startTime: string;
  divisionId: number;
  isPremier: boolean;
}

export interface ITimeSlot {
  id: number;
  time: string;
}

const fields: IField[] = [
  {
    id: 0,
    facilityId: 0,
    name: 'Field 0',
    isPremier: true,
  },
  {
    id: 1,
    facilityId: 0,
    name: 'Field 1',
    isPremier: true,
  },
  {
    id: 2,
    facilityId: 0,
    name: 'Field 2',
    isPremier: false,
  },
  {
    id: 3,
    facilityId: 0,
    name: 'Field 3',
    isPremier: false,
  },
  {
    id: 4,
    facilityId: 0,
    name: 'Field 4',
    isPremier: false,
  },
  {
    id: 5,
    facilityId: 0,
    name: 'Field 5',
    isPremier: false,
  },
  {
    id: 6,
    facilityId: 0,
    name: 'Field 6',
    isPremier: false,
  },
  {
    id: 7,
    facilityId: 1,
    name: 'Field 7',
    isPremier: false,
  },
  {
    id: 8,
    facilityId: 1,
    name: 'Field 8',
    isPremier: false,
  },
];

const teams: ITeam[] = [
  {
    id: 0,
    name: 'Team # 1',
    startTime: '02/02/2020 08:00:00',
    divisionId: 0,
    isPremier: true,
  },
  {
    id: 1,
    name: 'Team # 2',
    startTime: '02/02/2020 08:00:00',
    divisionId: 0,
    isPremier: false,
  },
  {
    id: 2,
    name: 'Team # 3',
    startTime: '02/02/2020 08:00:00',
    divisionId: 0,
    isPremier: false,
  },
  {
    id: 3,
    name: 'Team # 4',
    startTime: '02/02/2020 08:00:00',
    divisionId: 0,
    isPremier: true,
  },
  {
    id: 4,
    name: 'Team # 5',
    startTime: '02/02/2020 09:00:00',
    divisionId: 0,
    isPremier: false,
  },
  {
    id: 5,
    name: 'Team # 6',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 6,
    name: 'Team # 7',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 7,
    name: 'Team # 8',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 8,
    name: 'Team # 9',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 9,
    name: 'Team # 10',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: true,
  },
  // ONLY PREMIER TEAMS HERE ! (not anymore...)
  {
    id: 10,
    name: 'Team # 11',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 11,
    name: 'Team # 12',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 12,
    name: 'Team # 13',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 13,
    name: 'Team # 14',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 14,
    name: 'Team # 15',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 15,
    name: 'Team # 16',
    startTime: '02/02/2020 08:00:00',
    divisionId: 1,
    isPremier: false,
  },
  {
    id: 16,
    name: 'Team # 17',
    startTime: '02/02/2020 08:00:00',
    divisionId: 2,
    isPremier: false,
  },
];

interface IState {
  timeSlots?: ITimeSlot[];
}

class Schedules extends Component<{}, IState> {
  state = {
    timeSlots: [],
  };

  componentDidMount() {
    const firstGameTime = '08:00:00';
    const lastGameEnd = '16:00:00';
    const totalGameTime = 60;

    const timeSlots = calculateTimeSlots(
      firstGameTime,
      lastGameEnd,
      totalGameTime
    );

    this.setState({ timeSlots });
  }

  render() {
    const { timeSlots } = this.state;

    return (
      <div>
        <SchedulesMatrix timeSlots={timeSlots} fields={fields} teams={teams} />
      </div>
    );
  }
}

export default Schedules;
