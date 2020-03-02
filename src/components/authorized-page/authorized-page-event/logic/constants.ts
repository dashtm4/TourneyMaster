import { Icons, Routes } from 'common/constants';
import { EventMenuTitles } from 'common/enums';

export const EventMenu = [
  {
    isAllow: true,
    title: EventMenuTitles.EVENT_DETAILS,
    icon: Icons.PERSON,
    link: Routes.EVENT_DETAILS,
    children: [
      EventMenuTitles.PRIMARY_INFORMATION,
      EventMenuTitles.EVENT_STRUCTURE,
      EventMenuTitles.PLAYOFFS,
      EventMenuTitles.MEDIA_ASSETS,
    ],
  },
  {
    isAllow: false,
    title: EventMenuTitles.FACILITIES,
    icon: Icons.PLACE,
    link: Routes.FACILITIES,
    children: [],
  },
  {
    isAllow: false,
    title: EventMenuTitles.REGISTRATION,
    icon: Icons.LIST,
    link: Routes.REGISTRATION,
    children: [
      EventMenuTitles.PRIMARY_INFORMATION,
      EventMenuTitles.TEAMS_AND_ATHLETES,
      EventMenuTitles.MAIN_CONTACT,
    ],
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
    children: [
      EventMenuTitles.TEAM_MANAGEMENT,
      // EventMenuTitles.REQUEST_MANAGER,
    ],
  },
  {
    isAllow: false,
    title: EventMenuTitles.SCHEDULING,
    icon: Icons.CLOCK,
    link: Routes.SCHEDULING,
    children: [
      // EventMenuTitles.TOURNAMENT_PLAY, EventMenuTitles.BRACKETS
    ],
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
    link: Routes.REPORTING,
    icon: Icons.REPORT,
    children: [],
  },
];
