import { Icons, Routes } from '../../../common/constants';

const MenuList = [
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

// const MenuList = [
//   {
//     title: 'Event Details',
//     icon: Icons.PERSON,
//     link: Routes.EVENT_DETAILS,
//     children: [
//       'Primary Information',
//       'Event Structure',
//       'Playoffs',
//       'Media Assets',
//       'Advanced Settings',
//     ],
//   },
//   {
//     title: 'Facilities',
//     icon: Icons.PLACE,
//     link: Routes.FACILITIES,
//     children: null,
//   },
//   {
//     title: 'Registration',
//     icon: Icons.LIST,
//     link: Routes.REGISTRATION,
//     children: ['Primary Information', 'Teams &amp; Athletes', 'Main Contact'],
//   },
//   {
//     title: 'Divisions & Pools',
//     icon: Icons.PEOPLE,
//     link: Routes.DIVISIONS_AND_POOLS,
//     children: null,
//   },
//   {
//     title: 'Teams',
//     icon: Icons.TEAM,
//     link: Routes.TEAMS,
//     children: ['Team Management', 'Request Manager'],
//   },
//   {
//     title: 'Scheduling',
//     icon: Icons.CLOCK,
//     link: Routes.SCHEDULING,
//     children: ['Tournament Play', 'Brackets'],
//   },
//   {
//     title: 'Scoring',
//     link: Routes.SCORING,
//     icon: Icons.ERROR,
//     children: null,
//   },
//   {
//     title: 'Reporting',
//     link: Routes.REPORTING,
//     icon: Icons.REPORT,
//     children: null,
//   },
// ];
export default MenuList;
