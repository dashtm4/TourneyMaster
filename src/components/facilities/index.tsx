import React from 'react';
import { connect } from 'react-redux';
import Navigation from './components/navigation';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import FacilityDetails from './components/facility-details';
import { IFacility } from '../../common/models/facilities';
import styles from './styles.module.scss';
import Api from '../../api/api';
import { mockedFacilities } from './mocks/facilities';

interface State {
  facilitiesCount: number;
}

interface Props {
  facilities: IFacility[];
}

class Facilities extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      facilitiesCount: props.facilities.length,
    };
  }

  async componentDidMount() {
    const allFaсilities = await Api.get('/facilities');

    console.log(allFaсilities);
  }

  onChangeFacilitiesCount = (evt: any) => {
    this.setState({ facilitiesCount: evt.target.value });
  };

  render() {
    const { facilitiesCount } = this.state;
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
              value={`${facilitiesCount}`}
              options={['1', '2', '3']}
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

export default connect(() => ({
  facilities: mockedFacilities,
}))(Facilities);
