import React from 'react';
import Modal from 'components/common/modal';
import styles from './styles.module.scss';
import { BindingAction, BindingCbWithOne } from 'common/models';
import { IMapping } from 'common/models/table-columns';
import { getIcon } from 'helpers/get-icon.helper';
import { Icons } from 'common/enums/icons';
import { Button } from 'components/common';

const DELETE_ICON_STYLES = {
  width: '21px',
  margin: '0',
  fill: '#ff0f19',
};

interface IProps {
  isOpen: boolean;
  onClose: BindingAction;
  mappings: IMapping[];
  onMappingDelete: BindingCbWithOne<number>;
}

const ManageMapping = ({
  isOpen,
  onClose,
  mappings,
  onMappingDelete,
}: IProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container} style={{ overflowY: 'auto' }}>
        <div className={styles.sectionTitle}>Manage Historical Mappings</div>
        <ul>
          {mappings.map(map => (
            <li
              key={map.member_map_id}
              style={{
                width: '40%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600 }}>Name:</span>{' '}
              {map.import_description}
              <Button
                onClick={() => onMappingDelete(map.member_map_id)}
                icon={getIcon(Icons.DELETE, DELETE_ICON_STYLES)}
                label={<span className="visually-hidden">Delete mapping</span>}
                variant="text"
                color="inherit"
                type="icon"
              />
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default ManageMapping;
