import { Icons, Routes } from 'common/constants';
import { EventMenuTitles } from 'common/enums';

export const EventMenu = [
  {
    isAllow: true,
    title: EventMenuTitles.EVENT_DETAILS,
    icon: Icons.PERSON,
    link: Routes.EVENT_DETAILS,
    children: [
      'Primary Information',
      'Event Structure',
      'Playoffs',
      'Media Assets',
      'Advanced Settings',
    ],
  },
  {
    isAllow: false,
    title: EventMenuTitles.FACILITIES,
    icon: Icons.PLACE,
    link: '/event/facilities',
    children: [],
  },
  {
    isAllow: false,
    title: EventMenuTitles.REGISTRATION,
    icon: Icons.LIST,
    link: '/event/registration',
    children: ['Primary Information', 'Teams & Athletes', 'Main Contact'],
  },
  {
    isAllow: false,
    title: EventMenuTitles.DIVISIONS_AND_POOLS,
    icon: Icons.PEOPLE,
    link: Routes.DIVISIONS_AND_POOLS,
    children: [],
  },
  {
    isAllow: false,
    title: EventMenuTitles.TEAMS,
    icon: Icons.TEAM,
    link: Routes.TEAMS,
    children: ['Team Management', 'Request Manager'],
  },
  {
    isAllow: false,
    title: EventMenuTitles.SCHEDULING,
    icon: Icons.CLOCK,
    link: Routes.SCHEDULES,
    children: ['Tournament Play', 'Brackets'],
  },
  {
    isAllow: false,
    title: EventMenuTitles.SCORING,
    link: Routes.SCORING,
    icon: Icons.SCORING,
    children: [],
  },
  {
    isAllow: false,
    title: EventMenuTitles.REPORTING,
    link: '/event/reporting',
    icon: Icons.REPORT,
    children: [],
  },
];
