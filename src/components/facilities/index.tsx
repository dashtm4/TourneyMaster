import React from 'react';
import Navigation from './components/navigation';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import FacilityDetails from './components/facility-details';
import styles from './styles.module.scss';
import Api from '../../api/api';

interface State {
  facilitiesCount: number;
}

const request = async () => {
  const fas = {
    facilities_id: '99',
    event_id: 'ABC',
    city: 'Pflugerville',
    created_by: '4DC8A780',
    created_datetime: '2020-01-01T12:00:00.000Z',
  };

  const req = await Api.post('/facilities', fas);

  console.log(req);
};

class Facilities extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      facilitiesCount: 1,
    };
  }

  async componentDidMount() {
    const faсilities = await Api.get('/facilities');

    console.log(faсilities);
  }

  onChangeFacilitiesCount = (evt: any) => {
    this.setState({ facilitiesCount: evt.target.value });
  };

  render() {
    const { facilitiesCount } = this.state;

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
          <button onClick={() => request()}>REQ</button>
          <ul className={styles.facilitiesList}>
            {Array.from(new Array(+facilitiesCount), (_, idx) => (
              <li className={styles.facilitiesItem} key={idx}>
                <FacilityDetails isOpen={idx === 0} facilitiyNumber={idx + 1} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}

export default Facilities;
