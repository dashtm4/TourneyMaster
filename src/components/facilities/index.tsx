import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AppState } from './logic/reducer';
import {
  loadFacilities,
  addEmptyFacility,
  saveFacilities,
  updateFacilities,
} from './logic/actions';
import Navigation from './components/navigation';
import FacilityDetails from './components/facility-details';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import { IFacility } from '../../common/models/facilities';
import { BindingAction, BindingCbWithOne } from '../../common/models/callback';
import styles from './styles.module.scss';

interface MatchParams {
  eventId?: string;
}

interface Props {
  facilities: IFacility[];
  loadFacilities: BindingAction;
  addEmptyFacility: BindingAction;
  updateFacilities: BindingCbWithOne<IFacility>;
  saveFacilities: BindingCbWithOne<IFacility[]>;
}

class Facilities extends React.Component<
  Props & RouteComponentProps<MatchParams>
> {
  componentDidMount() {
    const { loadFacilities, addEmptyFacility } = this.props;
    const eventId = this.props.match.params.eventId;

    eventId ? loadFacilities() : addEmptyFacility();
  }

  onChangeFacilitiesCount = (evt: any) => {
    const { facilities, addEmptyFacility } = this.props;

    if (evt.target.value > facilities.length) {
      addEmptyFacility();
    }
  };

  savingFacilities = () => {
    const { facilities, saveFacilities } = this.props;

    saveFacilities(facilities);
  };

  render() {
    const { facilities, updateFacilities } = this.props;

    return (
      <section>
        <Navigation onClick={this.savingFacilities} />
        <div className={styles.sectionWrapper}>
          <div className={styles.headingWrapper}>
            <HeadingLevelTwo>Facilities</HeadingLevelTwo>
          </div>
          <div className={styles.numberWrapper}>
            <span className={styles.numberTitleWrapper}>
              Number of Facilities
            </span>
            <Select
              onChange={this.onChangeFacilitiesCount}
              value={`${facilities.length}`}
              options={Array.from(
                new Array(facilities.length + 1),
                (_, idx) => ({ label: `${idx + 1}`, value: `${idx + 1}` })
              )}
              width="160px"
            />
          </div>
          <ul className={styles.facilitiesList}>
            {facilities.map((it, idx) => (
              <li className={styles.facilitiesItem} key={it.facilities_id}>
                <FacilityDetails
                  facility={it}
                  facilitiyNumber={idx + 1}
                  updateFacilities={updateFacilities}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}

interface IRootState {
  facilities: AppState;
}

export default connect(
  (state: IRootState) => ({
    facilities: state.facilities.facilities,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      { saveFacilities, loadFacilities, addEmptyFacility, updateFacilities },
      dispatch
    )
)(Facilities);
