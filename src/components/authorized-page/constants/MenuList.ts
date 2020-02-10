import { Icons, Routes } from '../../../common/constants';

export const MenuList = [
  {
    title: 'My Dashboard',
    icon: Icons.PERSON,
    link: Routes.DASHBOARD,
    children: null,
  },
  {
    title: 'Library Manager',
    icon: Icons.INSERT_DRIVE,
    link: Routes.LIBRARY_MANAGER,
    children: [
      'Tournaments',
      'Facilities',
      'Registration',
      'Divisions & Pools',
      'Team Management',
      'Scheduling',
      'Messaging',
    ],
  },
  {
    title: 'EventLink',
    icon: Icons.EMAIL,
    link: Routes.EVENT_LINK,
    children: ['Messaging', 'Schedule Review'],
  },
  {
    title: 'Collaboration',
    icon: Icons.PEOPLE,
    link: Routes.COLLABORATION,
    children: null,
  },
  {
    title: 'Calendar',
    icon: Icons.CALENDAR,
    link: Routes.CALENDAR,
    children: null,
  },
  {
    title: 'Utilities',
    icon: Icons.SETTINGS,
    link: Routes.UTILITIES,
    children: ['Edit Profile', 'Email Setup'],
  },
  {
    title: 'Event Day Complexities',
    link: Routes.EVENT_DAY_COMPLEXITIES,
    icon: Icons.ERROR,
    children: null,
  },
];

export const MenuListForEvent = [
  {
    title: 'Event Details',
    icon: Icons.PERSON,
    link: '/event/event-details',
    children: [
      'Primary Information',
      'Event Structure',
      'Playoffs',
      'Media Assets',
      'Advanced Settings',
    ],
  },
  {
    title: 'Facilities',
    icon: Icons.PLACE,
    link: '/event/facilities',
    children: null,
  },
  {
    title: 'Registration',
    icon: Icons.LIST,
    link: '/event/registration',
    children: ['Primary Information', 'Teams & Athletes', 'Main Contact'],
  },
  {
    title: 'Divisions & Pools',
    icon: Icons.PEOPLE,
    link: '/event/divisions-and-pools',
    children: null,
  },
  {
    title: 'Teams',
    icon: Icons.TEAM,
    link: '/event/teams',
    children: ['Team Management', 'Request Manager'],
  },
  {
    title: 'Scheduling',
    icon: Icons.CLOCK,
    link: '/event/scheduling',
    children: ['Tournament Play', 'Brackets'],
  },
  {
    title: 'Scoring',
    link: '/event/scoring',
    icon: Icons.SCORING,
    children: null,
  },
  {
    title: 'Reporting',
    link: '/event/reporting',
    icon: Icons.REPORT,
    children: null,
  },
];
