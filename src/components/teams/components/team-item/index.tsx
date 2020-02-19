import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { ITeam } from '../../../../common/models';
import Button from '../../../common/buttons/button';
import { getIcon } from '../../../../helpers/get-icon.helper';
import { Icons } from '../../../../common/constants/icons';
import { DndItems } from '../../types';
import styles from './styles.module.scss';

const EDIT_ICON_STYLES = {
  width: '21px',
  margin: '0',
  fill: '#00a3ea',
};

const DELETE_ICON_STYLES = {
  margin: '0',
};

const BTN_STYLES = {
  minWidth: 'unset',
};

interface Props {
  team: ITeam;
  isEdit: boolean;
  changePool: (team: ITeam, poolId: string | null) => void;
}

const TeamItem = ({ team, isEdit, changePool }: Props) => {
  const item = { type: DndItems.TEAM };
  const [, drag] = useDrag({
    item,
    end(_, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();

      if (!dropResult) {
        return;
      }

      const { poolId, divisionId } = dropResult;

      if (divisionId === team.division_id && poolId !== team.pool_id) {
        changePool(team, poolId);
      }
    },
  });

  return (
    <li ref={drag} className={styles.team}>
      <span>{team.short_name}</span>
      {isEdit && (
        <p className={styles.btnsWrapper}>
          <span className={styles.delBtnWrapper}>
            <Button
              icon={getIcon(Icons.DELETE, DELETE_ICON_STYLES)}
              label={<span className="visually-hidden">Delete team</span>}
              variant="text"
              color="inherit"
              btnStyles={BTN_STYLES}
            />
          </span>
          <Button
            icon={getIcon(Icons.EDIT, EDIT_ICON_STYLES)}
            label={<span className="visually-hidden">Edit team</span>}
            variant="text"
            color="secondary"
            btnStyles={BTN_STYLES}
          />
        </p>
      )}
    </li>
  );
};

export default TeamItem;
