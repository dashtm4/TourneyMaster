import React from 'react';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import styles from './style.module.scss';
import Button from '../common/buttons/button';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Paper from '../common/paper';
import schedule from '../../assets/schedule.svg';
import TimelineCard from './timeline-card';
import NotificationsCard from './notifications-card';
import InfoCard from './info-card';
import TournamentCard from './tournament-card';
import tournamentLogoExample from '../../assets/tournamentLogoExample.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const data = [
  { message: 'Publish', link: 'Men’s Spring Thaw', date: '01/14/20' },
  { message: 'Create Tournament', link: 'Spring Lacrosse', date: '01/14/20' },
  {
    message: 'Release Retrospective for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '02/15/20',
  },
];

const notificationData = [
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
  {
    message: 'Robert Smith has added you as a collaborator for',
    link: 'Draft Summer Lacrosse',
    date: '01/14/20',
  },
  {
    message: 'Reminder: Release Retrospective is 2 weeks overdue for',
    link: 'Field Hockey I',
    date: '01/14/20',
  },
  {
    message: 'Post Tournament Play Scores for',
    link: 'Field Hockey 1',
    date: '01/14/20',
  },
];

const tournamentsData = [
  {
    id: '1',
    logo: tournamentLogoExample,
    title: 'Field Hockey I',
    date: '01/02/10-01/03/21',
    teamsRsvp: '2/8',
    locations: 1,
    status: 'Published',
    players: 122,
    fields: 2,
    schedule: 'Available',
  },
  {
    id: '2',
    logo: tournamentLogoExample,
    title: 'Field Hockey I',
    date: '01/02/10-01/03/21',
    teamsRsvp: '2/8',
    locations: 1,
    status: 'Draft',
    players: 122,
    fields: 2,
    schedule: 'Available',
  },
];

class Dashboard extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.dashboard}>
          <div className={styles.container}>
            <div className={styles.main}>
              <Paper>
                <div className={styles['main-menu']}>
                  <Button
                    label="Edit Dashboard Layout"
                    variant="text"
                    color="secondary"
                    icon={<EditIcon fontSize="small" />}
                  />
                  <Button
                    label="Create tournament"
                    variant="contained"
                    color="primary"
                  />
                </div>
              </Paper>
              <div className={styles.heading}>
                <HeadingLevelTwo>My Dashboard</HeadingLevelTwo>
              </div>
              <div className={styles['dashboard-cards-container']}>
                <InfoCard
                  icon={<AlternateEmailIcon fontSize="large" />}
                  info="0 Team Mentions"
                />
                <InfoCard
                  icon={<NotificationsIcon fontSize="large" />}
                  info="0 New Notifications"
                />
                <InfoCard
                  icon={<FormatListBulletedIcon fontSize="large" />}
                  info="2 Pending Tasks"
                />
              </div>
              <div className={styles['timeline-container']}>
                <TimelineCard data={data} />
                <img
                  src={schedule}
                  alt="schedule"
                  className={styles['schedule-image']}
                />
              </div>
              <NotificationsCard data={notificationData} />
              <div className={styles['tournaments-container']}>
                <div className={styles['tournaments-heading']}>
                  <div className={styles['card-header']}>
                    <div className={styles['card-title']}>
                      <FontAwesomeIcon
                        size="xs"
                        icon={faTrophy}
                        style={{ marginRight: '5px' }}
                      />
                      Tournaments
                    </div>
                  </div>
                  <div className={styles['buttons-group']}>
                    <Button
                      label="Published(1)"
                      variant="contained"
                      type="squared"
                      color="primary"
                    />
                    <Button
                      label="Draft (1)"
                      variant="contained"
                      type="squared"
                      color="primary"
                    />
                    <Button
                      label="Historical (0)"
                      variant="contained"
                      color="primary"
                      type="squaredOutlined"
                    />
                  </div>
                </div>
                {tournamentsData.map((tournament: any) => (
                  <TournamentCard key={tournament.id} data={tournament} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
