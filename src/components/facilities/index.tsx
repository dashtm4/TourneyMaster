import React from 'react';
import Navigation from './components/navigation';
import HeadingLevelTwo from '../common/headings/heading-level-two';
import Select from '../common/select';
import FacilitiesDetailsOne from './components/facilities-details-one';
import styles from './styles.module.scss';

const Facilities = () => (
  <>
    <Navigation />
    <section className={styles.sectionWrapper}>
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
        <li className={styles.facilitiesItem}>
          <FacilitiesDetailsOne />
        </li>
      </ul>
    </section>
  </>
);

export default Facilities;
