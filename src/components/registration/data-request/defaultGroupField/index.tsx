import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { BindingCbWithOne } from 'common/models';
import { DndItems } from 'components/registration/data-request/types';
import moveIcon from 'assets/moveIcon.png';
import styles from '../styles.module.scss';

interface IDefaultGroupField {
  data: any;
  updateRequestedIds: BindingCbWithOne<any>;
}

const DefaultGroupField = ({
  data,
  updateRequestedIds,
}: IDefaultGroupField) => {
  const [, drag] = useDrag({
    item: { type: DndItems.REGISTRANT_DATA_FIELD },
    end(_, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();

      if (!dropResult) {
        return;
      }

      const { name } = dropResult;
      if (name === 'requestGroup') {
        updateRequestedIds({
          id: data.data_field_id,
          status: 'add',
        });
      }
    },
  });

  return (
    <div ref={drag} className={styles.fieldWrapper}>
      <div className={styles.field}>
        {data.data_field_id}
        {data.data_label}
      </div>
      <span className={styles.iconWrapper}>
        <img
          src={moveIcon}
          style={{
            width: '21px',
            height: '21px',
            alignSelf: 'center',
          }}
          alt=""
        />
      </span>
    </div>
  );
};

export default DefaultGroupField;
