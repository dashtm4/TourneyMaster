import React from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import {
  Loader,
  Button,
  DeletePopupConfrim,
  HeadingLevelTwo,
  PopupAddToLibrary,
} from 'components/common';
import {
  deleteAllDivisions,
  getDivisionsTeams,
  getPools,
  savePool,
  saveTeams,
  saveDivisions,
  createDivisions,
  editPool,
  deletePool,
} from './logic/actions';
import { addEntitiesToLibrary } from 'components/authorized-page/authorized-page-event/logic/actions';
import Modal from '../common/modal';
import AddPool from './division/add-pool';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
  BindingCbWithThree,
} from 'common/models/callback';
import { ITeam, IDivision } from 'common/models';
import { IPool } from 'common/models';
import Navigation from './navigation';
import Division from './division';
import styles from './styles.module.scss';
import CsvLoader from 'components/common/csv-loader';
import { EntryPoints } from 'common/enums';
import { IEntity } from 'common/types';

interface IDivisionsAndPoolsProps {
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  isLoading: boolean;
  areDetailsLoading: boolean;
  history: History;
  match: any;
  deleteAllDivisions: BindingCbWithThree<IDivision[], IPool[], ITeam[]>;
  getDivisionsTeams: BindingCbWithOne<string>;
  getPools: BindingCbWithOne<string>;
  savePool: BindingCbWithOne<Partial<IPool>>;
  saveTeams: BindingCbWithOne<ITeam[]>;
  saveDivisions: BindingCbWithTwo<Partial<IDivision>[], string>;
  createDivisions: BindingCbWithOne<Partial<IDivision>[]>;
  addEntitiesToLibrary: BindingCbWithTwo<IEntity[], EntryPoints>;
  editPool: BindingCbWithTwo<IPool, IPool[]>;
  deletePool: BindingCbWithTwo<IPool, ITeam[]>;
}

interface IDivisionAndPoolsState {
  isModalOpen: boolean;
  selected: IDivision;
  isSectionsExpand: boolean;
  isCsvLoaderOpen: boolean;
  isLibraryPopupOpen: boolean;
  isDeletePopupOpen: boolean;
}

class DivisionsAndPools extends React.Component<
  IDivisionsAndPoolsProps,
  IDivisionAndPoolsState
  > {
  eventId = this.props.match.params.eventId;

  constructor(props: IDivisionsAndPoolsProps) {
    super(props);

    this.state = {
      isModalOpen: false,
      selected: this.props.divisions[0],
      isSectionsExpand: true,
      isCsvLoaderOpen: false,
      isLibraryPopupOpen: false,
      isDeletePopupOpen: false,
    };
  }

  componentDidMount() {
    this.props.getDivisionsTeams(this.eventId);
  }

  onAddDivision = () => {
    const path = this.eventId
      ? `/event/divisions-and-pools-add/${this.eventId}`
      : '/event/divisions-and-pools-add';
    this.props.history.push(path);
  };

  onAddPool = (division: IDivision) => {
    this.setState({ isModalOpen: true, selected: division });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  onCsvLoaderBtn = () => {
    this.setState({ isCsvLoaderOpen: true });
  };

  onCsvLoaderClose = () => {
    this.setState({ isCsvLoaderOpen: false });
  };

  toggleLibraryPopup = () => {
    this.setState(({ isLibraryPopupOpen }) => ({
      isLibraryPopupOpen: !isLibraryPopupOpen,
    }));
  };

  toggleSectionCollapse = () => {
    this.setState({ isSectionsExpand: !this.state.isSectionsExpand });
  };

  handleDeletePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    this.onDeletePopupOpen();
  };

  handleDeleteAllTeams = () => {
    const { divisions, pools, teams, deleteAllDivisions } = this.props;
    deleteAllDivisions(divisions, pools, teams);
    this.onDeletePopupClose();
  };

  onDeletePopupClose = () => {
    this.setState({ isDeletePopupOpen: false });
  };

  onDeletePopupOpen = () => {
    this.setState({ isDeletePopupOpen: true });
  };

  render() {
    const { divisions, pools, teams, isLoading, saveTeams } = this.props;
    const { isLibraryPopupOpen, isDeletePopupOpen } = this.state;

    return (
      <section className={styles.container}>
        <Navigation
          onCsvLoaderBtn={this.onCsvLoaderBtn}
          onAddDivision={this.onAddDivision}
          toggleLibraryPopup={this.toggleLibraryPopup}
        />
        <div className={styles.sectionContainer}>
          <div className={styles.headingContainer}>
            <div className={styles.heading}>
              <HeadingLevelTwo>Divisions &amp; Pools</HeadingLevelTwo>
              <a
                href="https://tourneymaster.s3.amazonaws.com/public/Quickstarts/TourneyMaster+Creating+Division+%26+Pools+Quick+Start+Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Quickstart Guide
              </a>
            </div>
            <div className={styles.buttonContainer}>
              {divisions?.length ? (
                <>
                  <Button
                    label="Delete All"
                    variant="text"
                    color="inherit"
                    onClick={this.handleDeletePopup}
                  />
                  <Button
                    label={
                      this.state.isSectionsExpand
                        ? 'Collapse All'
                        : 'Expand All'
                    }
                    variant="text"
                    color="secondary"
                    onClick={this.toggleSectionCollapse}
                  />
                </>
              ) : null}
            </div>
          </div>
          {isLoading && <Loader />}
          {divisions.length && !isLoading ? (
            <>
              <ul className={styles.divisionsList}>
                {divisions.map(division => (
                  <li key={division.division_id}>
                    <Division
                      eventId={this.eventId}
                      division={division}
                      pools={pools.filter(
                        pool => pool.division_id === division.division_id
                      )}
                      teams={teams.filter(
                        team => team.division_id === division.division_id
                      )}
                      onAddPool={this.onAddPool}
                      getPools={this.props.getPools}
                      areDetailsLoading={this.props.areDetailsLoading}
                      divisions={this.props.divisions}
                      isSectionExpand={this.state.isSectionsExpand}
                      saveTeams={saveTeams}
                      editPool={this.props.editPool}
                      deletePool={this.props.deletePool}
                    />
                  </li>
                ))}
                {this.state.selected && (
                  <Modal
                    isOpen={this.state.isModalOpen}
                    onClose={this.onModalClose}
                  >
                    <AddPool
                      division={this.state.selected}
                      onClose={this.onModalClose}
                      savePool={this.props.savePool}
                      numOfTeams={
                        teams.filter(
                          (team: ITeam) =>
                            team.division_id === this.state.selected.division_id
                        ).length
                      }
                    />
                  </Modal>
                )}
              </ul>
            </>
          ) : (
              !isLoading && (
                <div className={styles.noFoundWrapper}>
                  <span>There are no divisions yet.</span>
                </div>
              )
            )}
        </div>
        <CsvLoader
          isOpen={this.state.isCsvLoaderOpen}
          onClose={this.onCsvLoaderClose}
          type="divisions"
          onCreate={this.props.createDivisions}
          eventId={this.eventId}
        />
        <PopupAddToLibrary
          entities={divisions}
          entryPoint={EntryPoints.DIVISIONS}
          isOpen={isLibraryPopupOpen}
          onClose={this.toggleLibraryPopup}
          addEntitiesToLibrary={this.props.addEntitiesToLibrary}
        />
        <DeletePopupConfrim
          type={''}
          message={'Type "All Divisions" to delete'}
          deleteTitle={'All Divisions'}
          isOpen={isDeletePopupOpen}
          onClose={this.onDeletePopupClose}
          onDeleteClick={this.handleDeleteAllTeams}
        />
      </section>
    );
  }
}

interface IState {
  divisions: {
    data: IDivision[];
    pools: IPool[];
    teams: ITeam[];
    isLoading: boolean;
    areDetailsLoading: boolean;
  };
}

const mapStateToProps = (state: IState) => ({
  divisions: state.divisions.data,
  pools: state.divisions.pools,
  teams: state.divisions.teams,
  isLoading: state.divisions.isLoading,
  areDetailsLoading: state.divisions.areDetailsLoading,
});

const mapDispatchToProps = {
  deleteAllDivisions,
  getDivisionsTeams,
  getPools,
  savePool,
  saveTeams,
  saveDivisions,
  createDivisions,
  addEntitiesToLibrary,
  editPool,
  deletePool,
};

export default connect(mapStateToProps, mapDispatchToProps)(DivisionsAndPools);
