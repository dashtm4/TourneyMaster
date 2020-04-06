import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import {
  loadScoringData,
  loadPools,
  loadTeams,
  editTeam,
  deleteTeam,
} from './logic/actions';
import { IAppState } from 'reducers/root-reducer.types';
import Navigation from './components/navigation';
import ScoringItem from './components/scoring-Item';
import {
  HeadingLevelTwo,
  Modal,
  Loader,
  PopupTeamEdit,
  HazardList,
} from 'components/common';
import {
  IDivision,
  IPool,
  ITeam,
  BindingCbWithOne,
  ISchedulesGameWithNames,
  IMenuItem,
} from 'common/models';
import styles from './styles.module.scss';
import Button from 'components/common/buttons/button';

interface MatchParams {
  eventId: string;
}

interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  divisions: IDivision[];
  pools: IPool[];
  teams: ITeam[];
  games: ISchedulesGameWithNames[];
  incompleteMenuItems: IMenuItem[];
  loadScoringData: (eventId: string) => void;
  loadPools: (divisionId: string) => void;
  loadTeams: (poolId: string) => void;
  editTeam: BindingCbWithOne<ITeam>;
  deleteTeam: (teamId: string) => void;
}

interface State {
  changeableTeam: ITeam | null;
  currentDivision: string | null;
  currentPool: string | null;
  isModalOpen: boolean;
  expanded: boolean[];
  expandAll: boolean;
}

class Sсoring extends React.Component<
  Props & RouteComponentProps<MatchParams>,
  State
> {
  constructor(props: Props & RouteComponentProps<MatchParams>) {
    super(props);

    this.state = {
      currentDivision: null,
      currentPool: null,
      changeableTeam: null,
      isModalOpen: false,
      expanded: [],
      expandAll: false,
    };
  }

  componentDidMount() {
    const { loadScoringData } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadScoringData(eventId);
    }
  }

  onSaveTeam = () => {
    const { changeableTeam } = this.state;
    const { editTeam } = this.props;

    if (changeableTeam) {
      editTeam(changeableTeam);
    }

    this.onCloseModal();
  };

  onDeleteTeam = (team: ITeam) => {
    const { deleteTeam } = this.props;

    deleteTeam(team.team_id);

    this.onCloseModal();
  };

  onChangeTeam = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = evt;

    this.setState(({ changeableTeam }) => ({
      changeableTeam: { ...(changeableTeam as ITeam), [name]: value },
    }));
  };

  onOpenTeamDetails = (team: ITeam, divisionName: string, poolName: string) => {
    this.setState({
      isModalOpen: true,
      changeableTeam: team,
      currentDivision: divisionName,
      currentPool: poolName,
    });
  };

  onCloseModal = () =>
    this.setState({
      isModalOpen: false,
      changeableTeam: null,
      currentDivision: null,
      currentPool: null,
    });

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.divisions.length && !prevState.expanded.length) {
      this.setState({ expanded: this.props.divisions.map(_division => true) });
    }
  }

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
  };

  render() {
    const {
      isModalOpen,
      changeableTeam,
      currentDivision,
      currentPool,
    } = this.state;

    const {
      isLoading,
      pools,
      teams,
      divisions,
      loadPools,
      loadTeams,
      games,
      incompleteMenuItems,
    } = this.props;

    const isAllowViewPage = incompleteMenuItems.length === 0;

    if (!isAllowViewPage) {
      return (
        <HazardList
          incompleteMenuItems={incompleteMenuItems}
          eventId={this.props.match.params.eventId}
        />
      );
    }

    if (isLoading) {
      return <Loader />;
    }

    return (
      <section>
        <Navigation eventId={this.props.match.params.eventId} />
        <div className={styles.headingWrapper}>
          <div className={styles.headerContainer}>
            <HeadingLevelTwo>Scoring</HeadingLevelTwo>
            {divisions?.length ? (
              <Button
                label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
                variant="text"
                color="secondary"
                onClick={this.onToggleAll}
              />
            ) : null}
          </div>
          <ul className={styles.scoringList}>
            {divisions.map((division, index) => (
              <ScoringItem
                division={division}
                pools={pools.filter(
                  pool => pool.division_id === division.division_id
                )}
                teams={teams}
                loadPools={loadPools}
                loadTeams={loadTeams}
                onOpenTeamDetails={this.onOpenTeamDetails}
                key={division.division_id}
                expanded={this.state.expanded[index]}
                index={index}
                onToggleOne={this.onToggleOne}
              />
            ))}
          </ul>
        </div>
        <Modal isOpen={isModalOpen} onClose={this.onCloseModal}>
          <PopupTeamEdit
            team={changeableTeam}
            division={currentDivision}
            pool={currentPool}
            onSaveTeamClick={this.onSaveTeam}
            onDeleteTeamClick={this.onDeleteTeam}
            onChangeTeam={this.onChangeTeam}
            onCloseModal={this.onCloseModal}
            games={games}
          />
        </Modal>
      </section>
    );
  }
}

export default connect(
  ({ scoring }: IAppState) => ({
    isLoading: scoring.isLoading,
    isLoaded: scoring.isLoaded,
    divisions: scoring.divisions,
    pools: scoring.pools,
    teams: scoring.teams,
    games: scoring.games,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { loadScoringData, loadPools, loadTeams, deleteTeam, editTeam },
      dispatch
    )
)(Sсoring);
