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
    id: 'LaxWorld Club',
    name: 'name0',
    startTime: 'startTime0',
    poolId: 'poolId0',
    divisionId: 'divisionId0',
    isPremier: false,
    games: [0, 1, 2],
    fieldId: 'fieldId0',
    timeSlotId: 0,
    teamPosition: 0,
  },
  {
    id: 'Big 4 HHH',
    name: 'name2',
    startTime: 'startTime2',
    poolId: 'poolId2',
    divisionId: 'divisionId2',
    isPremier: false,
    games: [0, 1, 2],
    fieldId: 'fieldId2',
    timeSlotId: 0,
    teamPosition: 0,
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
