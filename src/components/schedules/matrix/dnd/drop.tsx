import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import styles from './styles.module.scss';

interface Props {
  text: string;
  accept: string;
  id: number;
  onDrop: (item: any, item2: any) => void;
}

export default (props: Props) => {
  const { text, accept, onDrop, id } = props;
  const ref = useRef(null);

  const [dropItem, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [dragItem, drag] = useDrag({
    item: { type: accept, id },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // console.log('dropItem', dropItem);
  const { isOver, canDrop } = dropItem;
  const isActive = isOver && canDrop;

  const { isDragging } = dragItem;
  if (isDragging) {
    console.log('isDragging', isDragging);
  }

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={styles.cardContainer}
      style={{
        opacity: isActive ? 0.3 : 1,
        background: isActive === 1 ? '#f0f0f0' : 'transparent',
      }}
    >
      {text}
    </div>
  );
};

// import React, { useRef } from 'react';
// import { DropTargetMonitor, useDrop, XYCoord, useDrag } from 'react-dnd';
// import styles from './styles.module.scss';

// interface Props {
//   cardName: string;
//   index: number;
//   id: number;
//   text: string;
//   moveCard: (dragIndex: number, hoverIndex: number) => void;
// }

// interface DragItem {
//   index: number;
//   id: string;
//   type: string;
// }

// const GameDrop: React.FC<Props> = ({ cardName, index, id, text, moveCard }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const CARD = cardName;

//   const [, drop] = useDrop({
//     accept: CARD,
//     hover(item: DragItem, monitor: DropTargetMonitor) {
//       if (!ref.current) return;

//       const dragIndex = item.index;
//       const hoverIndex = index;

//       if (dragIndex === hoverIndex) return;

//       const hoverBoundingRect = ref.current!.getBoundingClientRect();

//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

//       const clientOffset = monitor.getClientOffset();

//       const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

//       moveCard(dragIndex, hoverIndex);

//       item.index = hoverIndex;
//     },
//   });

//   const [{ isDragging }, drag] = useDrag({
//     item: { type: CARD, id, index },
//     collect: (monitor: any) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const isActive = isOver && canDrop;
//   const opacity = isDragging ? 0.3 : 1;

//   drag(drop(ref));

//   return (
//     <div
//       ref={ref}
//       className={styles.cardContainer}
//       style={{
//         opacity,
//         background: opacity === 1 ? 'transparent' : '#f0f0f0',
//       }}
//     >
//       {text}
//     </div>
//   );
// };

// export default GameDrop;
