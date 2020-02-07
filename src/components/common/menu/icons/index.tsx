import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EmailIcon from '@material-ui/icons/Email';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import ErrorIcon from '@material-ui/icons/Error';
import PinIcon from './icon-pin-material';
import { Icons } from '../../../../common/constants';
import styles from './styles.module.scss';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import DescriptionIcon from '@material-ui/icons/Description';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import RoomIcon from '@material-ui/icons/Room';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const getIcon = (icon: string) => {
  switch (icon) {
    case Icons.PERSON:
      return <PersonIcon className={styles.itemTitleIcon} />;
    case Icons.INSERT_DRIVE:
      return <InsertDriveFileIcon className={styles.itemTitleIcon} />;
    case Icons.EMAIL:
      return <EmailIcon className={styles.itemTitleIcon} />;
    case Icons.EXPLAND_MORE:
      return <ExpandMoreIcon className={styles.itemTitleIcon} />;
    case Icons.PEOPLE:
      return <PeopleIcon className={styles.itemTitleIcon} />;
    case Icons.CALENDAR:
      return <CalendarTodayIcon className={styles.itemTitleIcon} />;
    case Icons.SETTINGS:
      return <SettingsIcon className={styles.itemTitleIcon} />;
    case Icons.ERROR:
      return <ErrorIcon className={styles.itemTitleIcon} />;
    case Icons.PIN:
      return <PinIcon />;
    case Icons.CLOCK:
      return <WatchLaterIcon className={styles.itemTitleIcon} />;
    case Icons.REPORT:
      return <DescriptionIcon className={styles.itemTitleIcon} />;
    case Icons.LIST:
      return <FormatListBulletedIcon className={styles.itemTitleIcon} />;
    case Icons.TEAM:
      return <GroupAddIcon className={styles.itemTitleIcon} />;
    case Icons.PLACE:
      return <RoomIcon className={styles.itemTitleIcon} />;
  }

  return null;
};

export { getIcon };
