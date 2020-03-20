import { EventMenuTitles, Icons, Routes } from 'common/enums';

export const EventMenu = [
  {
    title: EventMenuTitles.EVENT_DETAILS,
    icon: Icons.PERSON,
    link: Routes.EVENT_DETAILS,
    children: [
      EventMenuTitles.PRIMARY_INFORMATION,
      EventMenuTitles.EVENT_STRUCTURE,
      EventMenuTitles.PLAYOFFS,
      EventMenuTitles.MEDIA_ASSETS,
    ],
    isAllowEdit: true,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.FACILITIES,
    icon: Icons.PLACE,
    link: Routes.FACILITIES,
    children: [],
    isAllowEdit: false,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.REGISTRATION,
    icon: Icons.LIST,
    link: Routes.REGISTRATION,
    children: [],
    isAllowEdit: false,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.DIVISIONS_AND_POOLS,
    icon: Icons.PEOPLE,
    link: Routes.DIVISIONS_AND_POOLS,
    children: [],
    isAllowEdit: false,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.TEAMS,
    icon: Icons.TEAM,
    link: Routes.TEAMS,
    children: [
      EventMenuTitles.TEAM_MANAGEMENT,
      // EventMenuTitles.REQUEST_MANAGER,
    ],
    isAllowEdit: false,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.SCHEDULING,
    icon: Icons.CLOCK,
    link: Routes.SCHEDULING,
    children: [
      EventMenuTitles.TOURNEY_ARCHITECT,
      EventMenuTitles.TOURNAMENT_PLAY,
      EventMenuTitles.BRACKETS,
    ],
    isAllowEdit: false,
    isCompleted: false,
  },
  {
    title: EventMenuTitles.SCORING,
    link: Routes.SCORING,
    icon: Icons.SCORING,
    children: [],
    isAllowEdit: false,
  },
  {
    title: EventMenuTitles.REPORTING,
    link: Routes.REPORTING,
    icon: Icons.DESCRIPTION,
    children: [],
    isAllowEdit: false,
  },
];
