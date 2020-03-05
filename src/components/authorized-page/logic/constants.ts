import { Icons, Routes } from 'common/constants';
import { MenuTitles } from 'common/enums';

export const MenuList = [
  {
    isAllow: true,
    title: 'My Dashboard',
    icon: Icons.PERSON,
    link: Routes.DASHBOARD,
    children: [],
  },
  {
    isAllow: true,
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
    isAllow: true,
    title: 'EventLink',
    icon: Icons.EMAIL,
    link: Routes.EVENT_LINK,
    children: ['Messaging', 'Schedule Review'],
  },
  {
    isAllow: true,
    title: 'Collaboration',
    icon: Icons.PEOPLE,
    link: Routes.COLLABORATION,
    children: [],
  },
  {
    isAllow: true,
    title: 'Calendar',
    icon: Icons.CALENDAR,
    link: Routes.CALENDAR,
    children: [],
  },
  {
    isAllow: true,
    title: 'Utilities',
    icon: Icons.SETTINGS,
    link: Routes.UTILITIES,
    children: ['Edit Profile', 'Email Setup'],
  },
  {
    isAllow: true,
    title: 'Event Day Complexities',
    link: Routes.EVENT_DAY_COMPLEXITIES,
    icon: Icons.ERROR,
    children: [],
  },
];
