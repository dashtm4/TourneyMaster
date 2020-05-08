import React, { useState, useEffect } from 'react';
import Header from '../header';
import Footer from 'components/footer';
import styles from './styles.module.scss';
import axios from 'axios';
import { IEventDetails } from 'common/models';
import IteamSearch from './item-search';

axios.defaults.baseURL =
  process.env.REACT_APP_PUBLIC_API_BASE_URL ||
  'https://api.tourneymaster.org/public'; // TODO: Remove the hardcoded link when everyone is ok

const EventSearch = () => {
  const [events, setEvents] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    axios.get('/events').then(response => setEvents(response.data));
  }, []);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const matchedEvents = events.filter(
    (event: IEventDetails) =>
      event.is_published_YN &&
      event.event_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.mainSearch}>
        <div className={styles.mainSearchWrapper}>
          <h2 className={styles.mainSearchTitle}>Event Search: </h2>
          <form className={styles.mainSearchForm}>
            <label className={styles.mainSearchFormSearch}>
              <input
                value={searchValue}
                onChange={onSearch}
                type="search"
                placeholder="Tournament/Event Name"
              />
            </label>
            <div className={styles.mainSearchListWrapper}>
              <ul className={styles.mainSearchTournamentList}>
                {searchValue &&
                  matchedEvents.map((it: IEventDetails) => (
                    <IteamSearch event={it} key={it.event_id} />
                  ))}
              </ul>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EventSearch;
