import { MenuTitles, Icons, Routes } from 'common/enums';

export const MenuList = [
  {
    title: 'My Dashboard',
    icon: Icons.PERSON,
    link: Routes.DASHBOARD,
    children: [],
  },
  {
    title: 'Library Manager',
    icon: Icons.INSERT_DRIVE,
    link: Routes.LIBRARY_MANAGER,
    children: [
      // 'Tournaments',
      // 'Facilities',
      MenuTitles.REGISTRATION,
      // 'Divisions & Pools',
      // 'Team Management',
      // 'Scheduling',
      // 'Messaging',
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
    children: [],
  },
  {
    title: 'Calendar',
    icon: Icons.CALENDAR,
    link: Routes.CALENDAR,
    children: [],
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
    children: [],
  },
];
