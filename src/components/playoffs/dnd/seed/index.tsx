import React from 'react';
import { useDrag } from 'react-dnd';
import styles from './styles.module.scss';

interface IProps {
  id: number | string;
  name: string;
  type: string;
  dropped?: boolean;
}

const Seed = (props: IProps) => {
  const { id, name, type, dropped } = props;

  const [{ isDragging }, drag] = useDrag({
    item: { id, type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.8 : 1 }}
      className={`${styles.container} ${dropped ? styles.dropped : ''}`}
    >
      {name}
    </div>
  );
};

export default Seed;
