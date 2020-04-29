import React from 'react';
import { getIcon } from 'helpers';
import { Icons } from 'common/enums';

const STYLES_ICON = {
  width: '20px',
  height: '20px',
  marginRight: '9px',
};

interface Props {
  isPublish: boolean;
  title: string;
}

const publishedItem = ({ isPublish, title }: Props) => (
  <li>
    {isPublish
      ? getIcon(Icons.WARNING, {
          ...STYLES_ICON,
          fill: '#FFCB00',
        })
      : getIcon(Icons.CHECK_CIRCLE, {
          ...STYLES_ICON,
          fill: '#00CC47',
        })}
    {title}
  </li>
);

export default publishedItem;
