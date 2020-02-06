import React from 'react';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import { addEmptyFacility, saveFacilities } from './logic/actions';
import Navigation from './components/navigation';
import FacilityDetails from './components/facility-details';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import { IFacility } from '../../common/models/facilities';
import { BindingAction, BindingCbWithOne } from '../../common/models/callback';
import styles from './styles.module.scss';
// import Api from '../../api/api';

interface Props {
  facilities: IFacility[];
  addEmptyFacility: BindingAction;
  saveFacilities: BindingCbWithOne<any>;
}

interface State {
  isSaving: boolean;
  updatedFacilities: any;
}

class Facilities extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSaving: false,
      updatedFacilities: [],
    };
  }

  onSavingFacilities = () => {
    this.setState({ isSaving: true });
  };

  updateFacilities = (facility: IFacility) => {
    // const { saveFacilities } = this.props;
    // const { updatedFacilities } = this.state;

    this.setState(({ updatedFacilities }) => ({
      updatedFacilities: [...updatedFacilities, facility],
    }));

    // saveFacilities(updatedFacilities);

    this.setState({ isSaving: false });
  };

  onChangeFacilitiesCount = (evt: any) => {
    const { facilities, addEmptyFacility } = this.props;

    if (evt.target.value > facilities.length) {
      addEmptyFacility();
    }
  };

  render() {
    const { facilities } = this.props;
    const { isSaving } = this.state;

    return (
      <section>
        <Navigation onClick={this.onSavingFacilities} />
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
                  isSavingFacility={isSaving}
                  updateFacilities={this.updateFacilities}
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
  { addEmptyFacility, saveFacilities }
)(Facilities);
