import React from 'react';
import styles from './styles.module.scss';
import PoolsDetailsNav from './pools-details-nav';
import Pool from './pool';
import { IPool, ITeam, BindingCbWithOne, IDivision } from 'common/models';
import {
  Loader,
  Modal,
  DeletePopupConfrim,
  PopupExposure,
  PopupTeamEdit,
} from 'components/common';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const deleteMessage =
  'You are about to delete this team and this cannot be undone. Please, enter the name of the team to continue.';
interface IPoolsDetailsProps {
  onAddPool: BindingCbWithOne<IDivision>;
  division: IDivision;
  pools: IPool[];
  teams: ITeam[];
  areDetailsLoading: boolean;
  saveTeams: BindingCbWithOne<ITeam[]>;
}

const PoolsDetails = ({
  pools,
  teams,
  division,
  areDetailsLoading,
  onAddPool,
  saveTeams,
}: IPoolsDetailsProps) => {
  const [localTeams, changeLocalTeams] = React.useState<ITeam[]>(teams);
  const [configurableTeam, configutationTeam] = React.useState<ITeam | null>(
    null
  );
  const [currentDivisionName, changeDivisionName] = React.useState<
    string | null
  >(null);
  const [currentPoolName, changePoolName] = React.useState<string | null>(null);
  const [isArrange, toggleArrange] = React.useState<boolean>(false);
  const [isEditPopupOpen, toggleEditPopup] = React.useState<boolean>(false);
  const [isDeletePopupOpen, toggleDeletePopup] = React.useState<boolean>(false);
  const [isConfirmPopupOpen, toggleConfirmPopup] = React.useState<boolean>(
    false
  );

  const onCloseModal = () => {
    configutationTeam(null);

    toggleDeletePopup(false);

    toggleEditPopup(false);

    changeDivisionName(null);

    changePoolName(null);
  };

  const onToggleConfirmPopup = () => toggleConfirmPopup(!isConfirmPopupOpen);

  const onToggleArrange = () => toggleArrange(!isArrange);

  const onCancelClick = () => {
    changeLocalTeams(teams);

    onToggleConfirmPopup();

    toggleArrange(false);
  };

  const onSaveClick = () => {
    saveTeams(localTeams);

    toggleArrange(false);

    toggleConfirmPopup(false);
  };

  const onAdd = () => onAddPool(division);

  const changePool = (
    team: ITeam,
    divisionId: string,
    poolId: string | null
  ) => {
    const changedTeam = {
      ...team,
      division_id: divisionId,
      pool_id: poolId,
      isChange: true,
    };

    const changedTeams = localTeams.map(it =>
      it.team_id === changedTeam.team_id ? changedTeam : it
    );

    changeLocalTeams(changedTeams);
  };

  const onDeleteTeam = (team: ITeam) => {
    const changedTeams = localTeams.map(it =>
      it.team_id === team.team_id ? { ...it, isDelete: true } : it
    );

    changeLocalTeams(changedTeams);

    onCloseModal();
  };

  const onConfirmDeleteTeam = () => onDeleteTeam(configurableTeam!);

  const onDeletePopupOpen = (team: ITeam) => {
    configutationTeam(team);

    toggleDeletePopup(!isDeletePopupOpen);
  };

  const onEditPopupOpen = (
    team: ITeam,
    divisionName: string,
    poolName: string
  ) => {
    toggleEditPopup(!isEditPopupOpen);

    configutationTeam(team);

    changeDivisionName(divisionName);

    changePoolName(poolName);
  };

  const onChangeTeam = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const editedTeam = {
      ...configurableTeam,
      [name]: value,
      isChange: true,
    } as ITeam;

    configutationTeam(editedTeam);
  };

  const onSaveTeam = () => {
    if (configurableTeam) {
      const changedTeams = localTeams.map(it =>
        it.team_id === configurableTeam.team_id ? configurableTeam : it
      );

      changeLocalTeams(changedTeams);
    }

    onCloseModal();
  };

  const notDeletedTeams = localTeams.filter((it: ITeam) => !it.isDelete);

  const unassignedTeams = notDeletedTeams.filter(it => !it.pool_id);

  return (
    <>
      <div>
        <div className={styles.headingContainer}>
          <span className={styles.title}>Pools</span>
          <PoolsDetailsNav
            isArrange={isArrange}
            onAdd={onAdd}
            onArrange={onToggleArrange}
            onCancel={onToggleConfirmPopup}
            onSave={onSaveClick}
          />
        </div>
        {areDetailsLoading ? (
          <Loader />
        ) : (
          <div className={styles.poolsContainer}>
            <DndProvider backend={HTML5Backend}>
              <Pool
                division={division || null}
                teams={unassignedTeams}
                isArrange={isArrange}
                changePool={changePool}
                onDeletePopupOpen={onDeletePopupOpen}
                onEditPopupOpen={onEditPopupOpen}
              />
              {pools.map(pool => (
                <Pool
                  division={division}
                  pool={pool}
                  teams={notDeletedTeams.filter(
                    team => team.pool_id === pool.pool_id
                  )}
                  key={pool.pool_id}
                  isArrange={isArrange}
                  changePool={changePool}
                  onDeletePopupOpen={onDeletePopupOpen}
                  onEditPopupOpen={onEditPopupOpen}
                />
              ))}
            </DndProvider>
          </div>
        )}
      </div>
      <Modal
        isOpen={isDeletePopupOpen || isEditPopupOpen}
        onClose={onCloseModal}
      >
        <>
          {isDeletePopupOpen && (
            <DeletePopupConfrim
              type="team"
              message={deleteMessage}
              deleteTitle={configurableTeam?.long_name!}
              isOpen={isDeletePopupOpen}
              onClose={onCloseModal}
              onDeleteClick={onConfirmDeleteTeam}
            />
          )}
          {isEditPopupOpen && (
            <PopupTeamEdit
              team={configurableTeam}
              division={currentDivisionName}
              pool={currentPoolName}
              onChangeTeam={onChangeTeam}
              onSaveTeamClick={onSaveTeam}
              onDeleteTeamClick={onDeleteTeam}
              onCloseModal={onCloseModal}
            />
          )}
        </>
      </Modal>
      <PopupExposure
        isOpen={isConfirmPopupOpen}
        onClose={onToggleConfirmPopup}
        onExitClick={onCancelClick}
        onSaveClick={onSaveClick}
      />
    </>
  );
};

export default PoolsDetails;
