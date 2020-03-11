import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AppState } from './logic/reducer';
import {
  loadFacilities,
  loadFields,
  addEmptyFacility,
  addEmptyField,
  updateFacilities,
  updateField,
  uploadFileMap,
  saveFacilities,
} from './logic/actions';
import Navigation from './components/navigation';
import FacilityDetails from './components/facility-details';
import { HeadingLevelTwo, Select, Loader } from '../common';
import { IFacility, IField, IUploadFile } from '../../common/models';
import {
  BindingCbWithOne,
  BindingCbWithTwo,
} from '../../common/models/callback';
import styles from './styles.module.scss';

const MOCKED_EVENT_ID = 'ABC123';

interface MatchParams {
  eventId?: string;
}

interface Props {
  isLoading: boolean;
  facilities: IFacility[];
  fields: IField[];
  loadFacilities: (eventId: string) => void;
  loadFields: (facilityId: string) => void;
  addEmptyFacility: (eventId: string) => void;
  addEmptyField: (facilityId: string) => void;
  updateFacilities: BindingCbWithOne<IFacility>;
  updateField: BindingCbWithOne<IField>;
  saveFacilities: BindingCbWithTwo<IFacility[], IField[]>;
  uploadFileMap: (facility: IFacility, files: IUploadFile[]) => void;
}

class Facilities extends React.Component<
  Props & RouteComponentProps<MatchParams>
> {
  componentDidMount() {
    const { loadFacilities } = this.props;
    const eventId = this.props.match.params.eventId;

    if (eventId) {
      loadFacilities(eventId);
    }
  }

  onChangeFacilitiesCount = (evt: any) => {
    const { facilities, addEmptyFacility } = this.props;
    const eventId = this.props.match.params.eventId;

    if (evt.target.value > facilities.length) {
      addEmptyFacility(eventId || MOCKED_EVENT_ID);
    }
  };

  savingFacilities = () => {
    const { facilities, fields, saveFacilities } = this.props;

    saveFacilities(facilities, fields);
  };

  render() {
    const {
      isLoading,
      facilities,
      fields,
      loadFields,
      addEmptyField,
      updateFacilities,
      updateField,
      uploadFileMap,
    } = this.props;

    if (isLoading) {
      return <Loader />;
    }

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
              value={`${facilities.length || ''}`}
              options={Array.from(
                new Array(facilities.length + 1),
                (_, idx) => ({ label: `${idx + 1}`, value: `${idx + 1}` })
              )}
              width="160px"
            />
          </div>
          <ul className={styles.facilitiesList}>
            {facilities
              .sort((a, b) => {
                if (a.isChange || b.isChange) {
                  return 0;
                }

                return a.facilities_description.localeCompare(
                  b.facilities_description,
                  undefined,
                  { numeric: true }
                );
              })
              .map((facilitiy, idx) => (
                <li
                  className={styles.facilitiesItem}
                  key={facilitiy.facilities_id}
                >
                  <FacilityDetails
                    facility={facilitiy}
                    fields={fields.filter(
                      it => it.facilities_id === facilitiy.facilities_id
                    )}
                    facilitiyNumber={idx + 1}
                    loadFields={loadFields}
                    addEmptyField={addEmptyField}
                    updateFacilities={updateFacilities}
                    updateField={updateField}
                    uploadFileMap={uploadFileMap}
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
    isLoading: state.facilities.isLoading,
    facilities: state.facilities.facilities,
    fields: state.facilities.fields,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadFacilities,
        loadFields,
        addEmptyFacility,
        addEmptyField,
        updateFacilities,
        updateField,
        saveFacilities,
        uploadFileMap,
      },
      dispatch
    )
)(Facilities);
