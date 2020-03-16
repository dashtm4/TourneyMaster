const mockedFields = [
  {
    id: '0',
    facilityId: '0',
    name: 'Field 1',
    isPremier: false,
  },
  {
    id: '1',
    facilityId: '2',
    name: 'Field 2',
    isPremier: false,
  },
];

const mockedTeamCards = [
  {
    id: '0',
    name: 'LaxWorld Club',
    startTime: 'startTime0',
    poolId: 'poolId0',
    divisionId: 'divisionId0',
    isPremier: false,
    games: [0, 1, 2],
    fieldId: 'fieldId0',
    timeSlotId: 0,
    teamPosition: 0,
    divisionShortName: '2020',
    divisionHex: '#1C315F',
  },
  {
    id: '1',
    name: 'Big 4 HHH',
    startTime: 'startTime2',
    poolId: 'poolId2',
    divisionId: 'divisionId2',
    isPremier: false,
    games: [0, 1, 2],
    fieldId: 'fieldId2',
    timeSlotId: 0,
    teamPosition: 0,
    divisionShortName: '2020',
    divisionHex: '#1C315F',
    errors: ['This team cannot play at this time.'],
  },
  {
    id: '2',
    name: 'unassigned Team',
    startTime: 'startTime0',
    poolId: 'poolId0',
    divisionId: 'divisionId0',
    isPremier: false,
    games: [0, 1, 2],
    teamPosition: 0,
    divisionShortName: '2020',
    divisionHex: '#1C315F',
  },
];

const mockedGames = [
  {
    id: 0,
    startTime: 'startTime0',
    facilityId: 'facilityId0',
    homeTeam: mockedTeamCards[0],
    awayTeam: mockedTeamCards[1],
    timeSlotId: 1,
    fieldId: 'fieldId0',
    isPremier: false,
  },
];

const mockedTimeSlots = [
  {
    id: 0,
    time: '08:00 AM',
  },
  {
    id: 1,
    time: '11:00 AM',
  },
];

export { mockedFields, mockedGames, mockedTeamCards, mockedTimeSlots };
