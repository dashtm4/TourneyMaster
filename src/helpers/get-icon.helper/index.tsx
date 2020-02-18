import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import EmailIcon from '@material-ui/icons/Email';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import ErrorIcon from '@material-ui/icons/Error';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import DescriptionIcon from '@material-ui/icons/Description';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import RoomIcon from '@material-ui/icons/Room';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CreateIcon from '@material-ui/icons/Create';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { PinIcon } from './own-icons';
import { Icons } from '../../common/constants/icons';
import styles from './styles.module.scss';

const getIcon = (icon: string, iconStyles?: object): JSX.Element => {
  switch (icon) {
    case Icons.PERSON:
      return <PersonIcon className={styles.icon} />;
    case Icons.INSERT_DRIVE:
      return <InsertDriveFileIcon className={styles.icon} />;
    case Icons.EMAIL:
      return <EmailIcon className={styles.icon} />;
    case Icons.EXPLAND_MORE:
      return <ExpandMoreIcon className={styles.icon} />;
    case Icons.PEOPLE:
      return <PeopleIcon className={styles.icon} />;
    case Icons.CALENDAR:
      return <CalendarTodayIcon className={styles.icon} />;
    case Icons.SETTINGS:
      return <SettingsIcon className={styles.icon} />;
    case Icons.ERROR:
      return <ErrorIcon className={styles.icon} />;
    case Icons.PIN:
      return <PinIcon />;
    case Icons.CLOCK:
      return <WatchLaterIcon className={styles.icon} />;
    case Icons.REPORT:
      return <DescriptionIcon className={styles.icon} />;
    case Icons.LIST:
      return <FormatListBulletedIcon className={styles.icon} />;
    case Icons.TEAM:
      return <GroupAddIcon className={styles.icon} />;
    case Icons.PLACE:
      return <RoomIcon className={styles.icon} />;
    case Icons.SCORING:
      return <CreateIcon className={styles.icon} />;
    case Icons.EDIT:
      return (
        <EditIcon
          className={iconStyles ? '' : styles.icon}
          style={iconStyles && iconStyles}
        />
      );
    case Icons.DELETE:
      return (
        <DeleteIcon
          className={iconStyles ? '' : styles.icon}
          style={iconStyles && iconStyles}
        />
      );
  }

  return <ClearIcon className={styles.icon} />;
};

export { getIcon };
