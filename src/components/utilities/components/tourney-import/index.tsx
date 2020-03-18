import React from 'react';
import styles from './styles.module.scss';
import { MenuTitles } from 'common/enums';
import { HeadingLevelThree, SectionDropdown, Input } from 'components/common';
import FullWidthTabs from './tab';
import { BindingCbWithOne } from 'common/models';

interface Props {
  onGetTid: BindingCbWithOne<any>;
  jobStatus: Array<string>;
  events: any;
  games: any;
  pools: any;
  locations: any;
  onDataLoaded: BindingCbWithOne<any>;
  dataLoaded: Boolean;
}

const TourneyImport: React.FC<Props> = ({
  onGetTid,
  jobStatus,
  events,
  games,
  pools,
  locations,
  onDataLoaded,
  dataLoaded
}) => {
  const [showData, setShowData] = React.useState(false);
  React.useEffect(() => {
    if (events.length !== 0 && games.length !== 0 && pools.length !== 0 && locations.length !== 0) {
      setShowData(true);
      onDataLoaded(true);
    }
  }, [events, games, pools, locations, onDataLoaded]);

  return (
    <SectionDropdown
      id={MenuTitles.TOURNEY_IMPORT_TITLE}
      type="section"
      panelDetailsType="flat"
      isDefaultExpanded={true}
    >
      <HeadingLevelThree>
        <span className={styles.detailsSubtitle}>{MenuTitles.TOURNEY_IMPORT_TITLE}</span>
      </HeadingLevelThree>
      <div className={styles.tournanment}>
        {
          !dataLoaded ? (
            <div className={styles.tournanmentHeader}>
              <Input
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  onGetTid(evt.target.value)
                }
                label="Enter the Identifier of the External Tournament: "
                fullWidth={true}
              />
            </div>
          ) : null
        }
        <div className={styles.tournanmentBody}>
          <br />
          <div className={styles.tabHeader}>
            {
              jobStatus.map((status, index) => {
                return (status !== '') ? <h3 className={styles.status} key={index}>{(index + 1)}. {status}</h3> : null
              })
            }
          </div>
          {
            showData ? <FullWidthTabs events={events} locations={locations} pools={pools} games={games} /> : null
          }
        </div>
      </div>
    </SectionDropdown>
  )
};

export default TourneyImport;