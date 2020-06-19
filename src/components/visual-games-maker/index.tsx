import React, { Component } from 'react';
import { ITeam } from 'common/models';
import { IPageEventState } from 'components/authorized-page/authorized-page-event/logic/reducer';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

interface IMapStateToProps {
  teams?: ITeam[] | undefined;
}

interface IMapDispatchToProps {}

interface IComponentProps {}

interface IRootState {
  pageEvent?: IPageEventState;
}

type IProps = IMapStateToProps & IMapDispatchToProps & IComponentProps;

interface IState {}

class VisualGamesMaker extends Component<IProps, IState> {
  render() {
    return (
      <>
        <div>Visual Games Maker</div>
      </>
    );
  }
}

const mapStateToProps = ({ pageEvent }: IRootState): IMapStateToProps => ({
  teams: pageEvent?.tournamentData.teams,
});

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => bindActionCreators({}, dispatch);

export default connect<IMapStateToProps, IMapDispatchToProps>(mapStateToProps, mapDispatchToProps)(VisualGamesMaker);
