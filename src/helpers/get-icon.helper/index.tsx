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
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import WarningIcon from '@material-ui/icons/Warning';
import FileCopy from '@material-ui/icons/FileCopy';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneIcon from '@material-ui/icons/Done';
import { PinIcon } from './own-icons';
import { Icons } from '../../common/enums/icons';

const getIcon = (icon: string, iconStyles?: object): JSX.Element => {
  switch (icon) {
    case Icons.PERSON:
      return <PersonIcon style={iconStyles} />;
    case Icons.INSERT_DRIVE:
      return <InsertDriveFileIcon style={iconStyles} />;
    case Icons.EMAIL:
      return <EmailIcon style={iconStyles} />;
    case Icons.EXPLAND_MORE:
      return <ExpandMoreIcon style={iconStyles} />;
    case Icons.PEOPLE:
      return <PeopleIcon style={iconStyles} />;
    case Icons.CALENDAR:
      return <CalendarTodayIcon style={iconStyles} />;
    case Icons.SETTINGS:
      return <SettingsIcon style={iconStyles} />;
    case Icons.ERROR:
      return <ErrorIcon style={iconStyles} />;
    case Icons.PIN:
      return <PinIcon style={iconStyles} />;
    case Icons.CLOCK:
      return <WatchLaterIcon style={iconStyles} />;
    case Icons.REPORT:
      return <DescriptionIcon style={iconStyles} />;
    case Icons.LIST:
      return <FormatListBulletedIcon style={iconStyles} />;
    case Icons.TEAM:
      return <GroupAddIcon style={iconStyles} />;
    case Icons.PLACE:
      return <RoomIcon style={iconStyles} />;
    case Icons.SCORING:
      return <CreateIcon style={iconStyles} />;
    case Icons.EDIT:
      return <EditIcon style={iconStyles} />;
    case Icons.DELETE:
      return <DeleteIcon style={iconStyles} />;
    case Icons.GET_APP:
      return <GetAppIcon style={iconStyles} />;
    case Icons.PUBLISH:
      return <PublishIcon style={iconStyles} />;
    case Icons.EMODJI_OBJECTS:
      return <EmojiObjectsIcon style={iconStyles} />;
    case Icons.WARNING:
      return <WarningIcon style={iconStyles} />;
    case Icons.FILE_COPY:
      return <FileCopy style={iconStyles} />;
    case Icons.CHECK_CIRCLE:
      return <CheckCircleIcon style={iconStyles} />;
    case Icons.DONE:
      return <DoneIcon style={iconStyles} />;
  }

  return <ClearIcon />;
};

export { getIcon };
