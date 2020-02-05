import React from 'react';
import Navigation from './components/navigation';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import FacilitiesDetails from './components/facilities-details';
import styles from './styles.module.scss';

const FACILITIES_COUNT = 2;

const Facilities = () => (
  <section>
    <Navigation />
    <div className={styles.sectionWrapper}>
      <div className={styles.headingWrapper}>
        <HeadingLevelTwo>Fasilities</HeadingLevelTwo>
      </div>
      <div className={styles.numberWrapper}>
        <span className={styles.numberTitleWrapper}>Number of Facilities</span>
        <Select
          value="none"
          options={['1', '2', '3']}
          label={'Choose number'}
        />
      </div>
      <ul className={styles.facilitiesList}>
        {Array.from(new Array(FACILITIES_COUNT), (_, idx) => (
          <li className={styles.facilitiesItem} key={idx}>
            <FacilitiesDetails facilitiyNumber={idx + 1} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Facilities;
