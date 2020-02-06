import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import { addEmptyFacility } from './logic/actions';
import Navigation from './components/navigation';
import FacilityDetails from './components/facility-details';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import { IFacility } from '../../common/models/facilities';
import { BindingAction } from '../../common/models/callback';
import styles from './styles.module.scss';
import Api from '../../api/api';

interface Props {
  facilities: IFacility[];
  addEmptyFacility: BindingAction;
}

class Facilities extends React.Component<Props> {
  async componentDidMount() {
    const allFaсilities = await Api.get('/facilities');

    console.log(allFaсilities);
  }

  onChangeFacilitiesCount = (evt: any) => {
    const { facilities, addEmptyFacility } = this.props;

    if (evt.target.value > facilities.length) {
      addEmptyFacility();
    }
  };

  render() {
    const { facilities } = this.props;

    return (
      <section>
        <Navigation />
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
  { addEmptyFacility }
)(Facilities);
