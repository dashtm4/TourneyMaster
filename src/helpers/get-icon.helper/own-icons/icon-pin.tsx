import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

interface Props {
  style?: object;
}

const PinIcon = ({ style }: Props) => (
  <SvgIcon style={style}>
    <g>
      <path d="m11.815 21.253c-.192 0-.384-.073-.53-.22l-8.318-8.319c-.141-.141-.22-.332-.22-.53 0-.199.079-.39.22-.53l1.734-1.734c1.021-1.022 2.804-1.022 3.827 0l5.552 5.551c1.055 1.055 1.055 2.772 0 3.828l-1.734 1.734c-.147.147-.338.22-.531.22z" />
      <path d="m21.17 11.492c-.442 0-.885-.168-1.222-.505l-6.935-6.935c-.327-.326-.507-.76-.507-1.222s.18-.896.507-1.223l1.388-1.387c.293-.293.768-.293 1.061 0l8.318 8.318c.293.293.293.768 0 1.061l-1.388 1.388c-.336.337-.779.505-1.222.505z" />
      <path d="m9.235 9.213 5.552 5.552c.18.181.339.375.474.581l3.816-3.816-6.606-6.607-3.823 3.823c.212.136.41.29.587.467z" />
      <path d="m5.889 17.05-5.669 5.67c-.293.293-.293.768 0 1.061.146.146.338.219.53.219s.384-.073.53-.22l5.669-5.669z" />
    </g>
  </SvgIcon>
);

export { PinIcon };
