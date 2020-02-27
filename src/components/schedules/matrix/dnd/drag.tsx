import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './styles.module.scss';

interface Props {
  text: string;
  type: string;
  id: number;
}

export default (props: Props) => {
  const { text, type, id } = props;

  const [dragItem, drag] = useDrag({
    item: { text, type, id },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const { isDragging } = dragItem;

  return (
    <div
      ref={drag}
      className={styles.dragContainer}
      style={{ background: isDragging ? 'green' : '#4a4a4a' }}
    >
      {text}
    </div>
  );
};
