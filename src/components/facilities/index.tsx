import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { IAppState } from 'reducers/root-reducer.types';
import {
  loadFacilities,
  loadFields,
  addEmptyFacility,
  addEmptyField,
  updateFacilities,
  updateField,
  uploadFileMap,
  saveFacilities,
  createFacilities,
} from './logic/actions';
import Navigation from './components/navigation';
import FacilityDetails from './components/facility-details';
import {
  HeadingLevelTwo,
  Select,
  Loader,
  Button,
  PopupExposure,
  CsvLoader,
  PopupAddToLibrary,
} from 'components/common';
import {
  IFacility,
  IField,
  IUploadFile,
  BindingCbWithOne,
  BindingCbWithTwo,
} from 'common/models';
import styles from './styles.module.scss';
import history from '../../browserhistory';
import { EntryPoints } from 'common/enums';

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
  addEmptyField: (facilityId: string, fieldsLength: number) => void;
  updateFacilities: BindingCbWithOne<IFacility>;
  updateField: BindingCbWithOne<IField>;
  saveFacilities: BindingCbWithTwo<IFacility[], IField[]>;
  uploadFileMap: (facility: IFacility, files: IUploadFile[]) => void;
  createFacilities: (facilities: IFacility[]) => void;
  expanded: boolean[];
  expandAll: boolean;
  isModalOpen: boolean;
}

class Facilities extends React.Component<
  Props & RouteComponentProps<MatchParams>
> {
  state = {
    expanded: [],
    expandAll: false,
    isModalOpen: false,
    isCsvLoaderOpen: false,
  };

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

    this.setState({ isModalOpen: false });
  };

  componentDidUpdate(prevProps: any, prevState: any) {
    if (
      (prevProps.facilities.length && !prevState.expanded.length) ||
      prevProps.facilities !== this.props.facilities
    ) {
      this.setState({
        expanded: this.props.facilities.map(_facility => true),
      });
    }
  }

  onToggleAll = () => {
    this.setState({
      expanded: this.state.expanded.map(_e => this.state.expandAll),
      expandAll: !this.state.expandAll,
    });
  };

  onToggleOne = (indexPanel: number) => {
    this.setState({
      expanded: this.state.expanded.map((e: boolean, index: number) =>
        index === indexPanel ? !e : e
      ),
    });
  };

  onModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  onCancelClick = () => {
    this.setState({ isModalOpen: true });
  };

  onCancel = () => {
    history.push('/');
  };

  onCsvLoaderBtn = () => {
    this.setState({ isCsvLoaderOpen: true });
  };

  onCsvLoaderClose = () => {
    this.setState({ isCsvLoaderOpen: false });
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
        <Navigation
          onClick={this.savingFacilities}
          onCancelClick={this.onCancelClick}
          onCsvLoaderBtn={this.onCsvLoaderBtn}
        />
        <div className={styles.sectionWrapper}>
          <div className={styles.headingWrapper}>
            <HeadingLevelTwo>Facilities</HeadingLevelTwo>
          </div>
          <div className={styles.numberWrapper}>
            <div className={styles.numberTitleWrapper}>
              <div>Number of Facilities</div>
            </div>
            <div className={styles.numberContainer}>
              <Select
                onChange={this.onChangeFacilitiesCount}
                value={`${facilities.length || ''}`}
                options={Array.from(
                  new Array(facilities.length + 1),
                  (_, idx) => ({ label: `${idx + 1}`, value: `${idx + 1}` })
                )}
                width="160px"
              />
              {facilities?.length ? (
                <Button
                  label={this.state.expandAll ? 'Expand All' : 'Collapse All'}
                  variant="text"
                  color="secondary"
                  onClick={this.onToggleAll}
                />
              ) : null}
            </div>
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
                    fields={fields
                      .filter(
                        it => it.facilities_id === facilitiy.facilities_id
                      )
                      .sort((a, b) => {
                        return (
                          Number(b.is_premier_YN) - Number(a.is_premier_YN)
                        );
                      })}
                    facilitiyNumber={idx + 1}
                    loadFields={loadFields}
                    addEmptyField={addEmptyField}
                    updateFacilities={updateFacilities}
                    updateField={updateField}
                    uploadFileMap={uploadFileMap}
                    expanded={this.state.expanded[idx]}
                    index={idx}
                    onToggleOne={this.onToggleOne}
                  />
                </li>
              ))}
          </ul>
        </div>
        <PopupExposure
          isOpen={this.state.isModalOpen}
          onClose={this.onModalClose}
          onExitClick={this.onCancel}
          onSaveClick={this.savingFacilities}
        />
        <CsvLoader
          isOpen={this.state.isCsvLoaderOpen}
          onClose={this.onCsvLoaderClose}
          type="facilities"
          onCreate={this.props.createFacilities}
          eventId={this.props.match.params.eventId}
        />
        <PopupAddToLibrary
          entities={facilities}
          entryPoint={EntryPoints.FACILITIES}
          isOpen={true}
          onClose={() => {}}
          onSave={() => {}}
        />
      </section>
    );
  }
}

export default connect(
  (state: IAppState) => ({
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
        createFacilities,
      },
      dispatch
    )
)(Facilities);
