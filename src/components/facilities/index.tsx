import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import Api from '../../api/api';
import styles from './styles.module.scss';

interface Props {
  facilities: IFacility[];
  loadFacilities: BindingAction;
  addEmptyFacility: BindingAction;
  updateFacilities: BindingCbWithOne<IFacility>;
  saveFacilities: BindingCbWithOne<any>;
}

const postRequest = async () => {
  const fac = {
    event_id: 'ABC123',
    facilities_description: 'BIG',
    num_fields: null,
    restrooms: null,
    num_toilets: null,
    restroom_details: null,
    parking_available: null,
    parking_details: null,
    parking_proximity: null,
    golf_carts_availabe: null,
    created_by: '4DC8A780',
  };

  const req = await Api.post('/facilities', fac);

  console.log(req);
};

class Facilities extends React.Component<Props, any> {
  onChangeFacilitiesCount = (evt: any) => {
    const { facilities, addEmptyFacility } = this.props;

    if (evt.target.value > facilities.length) {
      addEmptyFacility();
    }
  };

  savingFacilities = () => {
    const { facilities } = this.props;

    saveFacilities(facilities);
  };

  render() {
    const { facilities, loadFacilities, updateFacilities } = this.props;

    loadFacilities();

    return (
      <section>
        <Navigation onClick={this.savingFacilities} />
        <div className={styles.sectionWrapper}>
          <div className={styles.headingWrapper}>
            <HeadingLevelTwo>Facilities</HeadingLevelTwo>
          </div>
          <button onClick={postRequest}>REQ</button>
          <div className={styles.numberWrapper}>
            <span className={styles.numberTitleWrapper}>
              Number of Facilities
            </span>
            <Select
              onChange={this.onChangeFacilitiesCount}
              value={`${facilities.length}`}
              options={Array.from(
                new Array(facilities.length + 1),
                (_, idx) => `${idx + 1}`
              )}
              width="160px"
            />
          </div>
          <ul className={styles.facilitiesList}>
            {facilities.map((it, idx) => (
              <li className={styles.facilitiesItem} key={it.facilities_id}>
                <FacilityDetails
                  facility={it}
                  isOpen={idx === 0}
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
      { loadFacilities, addEmptyFacility, saveFacilities, updateFacilities },
      dispatch
    )
)(Facilities);
